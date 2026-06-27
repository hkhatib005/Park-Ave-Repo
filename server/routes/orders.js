const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Public — place order
router.post('/', (req, res) => {
  const { customer_name, customer_email, customer_phone, shipping_address, items, subtotal, total, notes } = req.body;
  if (!customer_name || !customer_email || !shipping_address || !items || !total) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const order_number = 'PAJ-' + uuidv4().slice(0, 8).toUpperCase();
  db.prepare(`
    INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, total, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(order_number, customer_name, customer_email, customer_phone || null, JSON.stringify(shipping_address), JSON.stringify(items), subtotal, total, notes || null);

  res.status(201).json({ order_number, message: 'Order placed successfully' });
});

// Admin routes
router.get('/', auth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items), shipping_address: JSON.parse(o.shipping_address) })));
});

router.get('/:id', auth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json({ ...order, items: JSON.parse(order.items), shipping_address: JSON.parse(order.shipping_address) });
});

router.patch('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ message: 'Status updated' });
});

module.exports = router;
