const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const db = require('../db/database');
const { customerAuth } = require('../middleware/customerAuth');
const { JWT_SECRET } = require('../config');

const router = express.Router();
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again later.' },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function issueToken(customer) {
  return jwt.sign({ id: customer.id, email: customer.email, name: customer.name, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });
}

function publicCustomer(c) {
  return { id: c.id, email: c.email, name: c.name };
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
  const customer = { id: result.lastInsertRowid, email: email.toLowerCase(), name };
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
      customer = { id: result.lastInsertRowid, email, name: payload.name || email };
    } catch {
      // Unverified email collided with an existing account — refuse rather than crash.
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
  } else if (!customer.google_id) {
    db.prepare('UPDATE customers SET google_id = ? WHERE id = ?').run(payload.sub, customer.id);
  }

  res.json({ token: issueToken(customer), customer: publicCustomer(customer) });
});

router.get('/me', customerAuth, (req, res) => {
  const customer = db.prepare('SELECT id, email, name, created_at FROM customers WHERE id = ?').get(req.customer.id);
  if (!customer) return res.status(404).json({ error: 'Not found' });
  res.json(customer);
});

router.get('/orders', customerAuth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC').all(req.customer.id);
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items), shipping_address: JSON.parse(o.shipping_address) })));
});

module.exports = router;
