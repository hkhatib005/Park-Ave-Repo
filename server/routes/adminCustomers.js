const express = require('express');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {
  const rows = db.prepare(`
    SELECT c.id, c.email, c.name, c.google_id IS NOT NULL as via_google, c.created_at,
           COUNT(o.id) as order_count, COALESCE(SUM(CASE WHEN o.payment_status = 'paid' THEN o.total ELSE 0 END), 0) as total_spent
    FROM customers c
    LEFT JOIN orders o ON o.customer_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `).all();
  res.json(rows);
});

router.get('/:id', auth, (req, res) => {
  const customer = db.prepare('SELECT id, email, name, google_id IS NOT NULL as via_google, created_at FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Not found' });
  const orders = db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ ...customer, orders: orders.map(o => ({ ...o, items: JSON.parse(o.items), shipping_address: JSON.parse(o.shipping_address) })) });
});

module.exports = router;
