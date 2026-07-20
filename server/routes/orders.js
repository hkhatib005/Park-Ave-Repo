const express = require('express');
const db = require('../db/database');
const auth = require('../middleware/auth');
const { sendOrderStatusEmail } = require('../services/email');

const router = express.Router();

// Admin routes — order creation happens via /api/checkout (Stripe), not here.
router.get('/', auth, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items), shipping_address: JSON.parse(o.shipping_address) })));
});

router.get('/:id', auth, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json({ ...order, items: JSON.parse(order.items), shipping_address: JSON.parse(order.shipping_address) });
});

router.patch('/:id/status', auth, async (req, res) => {
  const { status, tracking_number, no_tracking } = req.body;
  const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  // Shipped has to come with either a real tracking number or an explicit
  // admin confirmation that none exists — never silently shipped with
  // nothing on file for the customer to go on.
  if (status === 'shipped' && !no_tracking && !tracking_number?.trim()) {
    return res.status(400).json({ error: 'Provide a tracking number, or confirm none is available' });
  }

  const result = status === 'shipped'
    ? db.prepare('UPDATE orders SET status = ?, tracking_number = ? WHERE id = ?').run(status, no_tracking ? null : tracking_number.trim(), req.params.id)
    : db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });

  const order = db.prepare('SELECT customer_name, customer_email, order_number, tracking_number FROM orders WHERE id = ?').get(req.params.id);
  try {
    await sendOrderStatusEmail({
      to: order.customer_email,
      name: order.customer_name,
      orderNumber: order.order_number,
      status,
      trackingNumber: order.tracking_number,
    });
  } catch (err) {
    console.error('Failed to send order status email:', err.message);
  }

  res.json({ message: 'Status updated' });
});

// Manual payment override — for phone/wire orders that don't go through Stripe.
router.patch('/:id/payment', auth, (req, res) => {
  const { payment_status, payment_method } = req.body;
  const valid = ['unpaid', 'paid', 'refunded'];
  if (!valid.includes(payment_status)) return res.status(400).json({ error: 'Invalid payment status' });
  const result = db.prepare('UPDATE orders SET payment_status = ?, payment_method = ? WHERE id = ?')
    .run(payment_status, payment_method || 'manual', req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Payment status updated' });
});

module.exports = router;
