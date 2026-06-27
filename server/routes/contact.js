const express = require('express');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email, and message required' });

  db.prepare('INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)')
    .run(name, email, phone || null, subject || null, message);

  res.json({ message: 'Message received. We will be in touch shortly.' });
});

router.get('/', auth, (req, res) => {
  res.json(db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all());
});

module.exports = router;
