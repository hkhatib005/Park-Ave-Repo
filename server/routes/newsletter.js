const express = require('express');
const rateLimit = require('express-rate-limit');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const subscribeLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

router.post('/', subscribeLimiter, (req, res) => {
  const { email } = req.body;
  if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ error: 'Valid email required' });

  try {
    db.prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)').run(email.toLowerCase());
  } catch (err) {
    if (!/UNIQUE/.test(err.message)) throw err;
    // already subscribed — treat as success, no need to leak that to the client
  }
  res.json({ message: 'Subscribed' });
});

router.get('/', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC').all());
});

module.exports = router;
