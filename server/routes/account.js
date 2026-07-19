const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const db = require('../db/database');
const { customerAuth } = require('../middleware/customerAuth');
const { JWT_SECRET } = require('../config');
const { sendPasswordResetEmail } = require('../services/email');

const router = express.Router();
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' },
});

// Forgot-password gets its own limiter keyed by the *target* email rather than
// IP — otherwise an attacker spreading requests across IPs faces no real limit
// on how many reset emails one victim's inbox receives, and this endpoint
// would still share a bucket with unrelated login/register/delete traffic.
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => {
    const email = req.body?.email;
    return email ? String(email).toLowerCase() : ipKeyGenerator(req.ip);
  },
  message: { error: 'Too many attempts. Try again later.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function issueToken(customer) {
  return jwt.sign(
    { id: customer.id, email: customer.email, name: customer.name, role: 'customer', tokenVersion: customer.token_version ?? 0 },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function publicCustomer(c) {
  return { id: c.id, email: c.email, name: c.name, has_password: !!c.password };
}

router.post('/register', authLimiter, (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Invalid email address' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const existing = db.prepare('SELECT id FROM customers WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'An account with this email already exists' });

  const hash = bcrypt.hashSync(password, 12);
  const result = db.prepare('INSERT INTO customers (email, name, password) VALUES (?, ?, ?)').run(email.toLowerCase(), name, hash);
  const customer = { id: result.lastInsertRowid, email: email.toLowerCase(), name, password: hash, token_version: 0 };
  res.status(201).json({ token: issueToken(customer), customer: publicCustomer(customer) });
});

router.post('/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(email.toLowerCase());
  if (!customer || !customer.password || !bcrypt.compareSync(password, customer.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: issueToken(customer), customer: publicCustomer(customer) });
});

router.post('/google', authLimiter, async (req, res) => {
  if (!googleClient) return res.status(503).json({ error: 'Google sign-in is not configured yet' });
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing credential' });

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    return res.status(401).json({ error: 'Invalid Google credential' });
  }

  const email = payload.email.toLowerCase();
  // Only trust an email match for account linking if Google has verified it — otherwise
  // an attacker with an unverified address matching an existing customer could hijack that account.
  let customer = payload.email_verified
    ? db.prepare('SELECT * FROM customers WHERE google_id = ? OR email = ?').get(payload.sub, email)
    : db.prepare('SELECT * FROM customers WHERE google_id = ?').get(payload.sub);

  if (!customer) {
    try {
      const result = db.prepare('INSERT INTO customers (email, name, google_id) VALUES (?, ?, ?)').run(email, payload.name || email, payload.sub);
      customer = { id: result.lastInsertRowid, email, name: payload.name || email, token_version: 0 };
    } catch {
      // Unverified email collided with an existing account — refuse rather than crash.
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
  } else if (!customer.google_id) {
    db.prepare('UPDATE customers SET google_id = ? WHERE id = ?').run(payload.sub, customer.id);
  }

  res.json({ token: issueToken(customer), customer: publicCustomer(customer) });
});

router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Valid email required' });

  const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(email.toLowerCase());

  // Always respond with the same body after roughly the same amount of time,
  // whether or not the account exists (or has a password to reset) —
  // otherwise both the response body AND its timing could be used to
  // enumerate registered emails (sending the reset email is the only branch
  // that's slow, so pad the other branch up to the same floor).
  const sendResetIfEligible = async () => {
    if (!customer || !customer.password) return;
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    db.prepare("UPDATE customers SET reset_token = ?, reset_token_expires = datetime('now', '+1 hour') WHERE id = ?")
      .run(hashedToken, customer.id);

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/account/reset-password?token=${rawToken}`;
    try {
      await sendPasswordResetEmail({ to: customer.email, name: customer.name, resetUrl });
    } catch (err) {
      console.error('Failed to send password reset email:', err.message);
    }
  };

  await Promise.all([sendResetIfEligible(), sleep(300)]);
  res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
});

router.post('/reset-password', authLimiter, (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ error: 'Token and new password are required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const customer = db.prepare("SELECT * FROM customers WHERE reset_token = ? AND reset_token_expires > datetime('now')").get(hashedToken);
  if (!customer) return res.status(400).json({ error: 'This reset link is invalid or has expired' });

  const hash = bcrypt.hashSync(password, 12);
  const nextTokenVersion = (customer.token_version ?? 0) + 1;
  // Bumping token_version invalidates every token issued before this reset —
  // including one an attacker may have stolen, which is the whole point of
  // letting someone reset their password in the first place.
  db.prepare('UPDATE customers SET password = ?, reset_token = NULL, reset_token_expires = NULL, token_version = ? WHERE id = ?')
    .run(hash, nextTokenVersion, customer.id);
  const updated = { ...customer, password: hash, token_version: nextTokenVersion };
  res.json({ token: issueToken(updated), customer: publicCustomer(updated) });
});

router.get('/me', customerAuth, (req, res) => {
  const customer = db.prepare('SELECT id, email, name, password, created_at FROM customers WHERE id = ?').get(req.customer.id);
  if (!customer) return res.status(404).json({ error: 'Not found' });
  res.json({ ...publicCustomer(customer), created_at: customer.created_at });
});

router.delete('/me', authLimiter, customerAuth, (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.customer.id);
  if (!customer) return res.status(404).json({ error: 'Not found' });

  if (customer.password) {
    const { password } = req.body;
    if (!password || !bcrypt.compareSync(password, customer.password)) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
  }

  // Orders are business records (accounting, inventory) — unlink rather than
  // delete them along with the account.
  const deleteAccount = db.transaction(() => {
    db.prepare('UPDATE orders SET customer_id = NULL WHERE customer_id = ?').run(customer.id);
    db.prepare('DELETE FROM customers WHERE id = ?').run(customer.id);
  });
  deleteAccount();

  res.json({ message: 'Account deleted' });
});

router.get('/orders', customerAuth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC').all(req.customer.id);
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items), shipping_address: JSON.parse(o.shipping_address) })));
});

module.exports = router;
