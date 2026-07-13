const express = require('express');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const db = require('../db/database');
const { optionalCustomerAuth } = require('../middleware/customerAuth');

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const checkoutLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });

router.post('/create-session', checkoutLimiter, optionalCustomerAuth, (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Payments are not configured yet. Set STRIPE_SECRET_KEY.' });

  const { customer_name, customer_email, customer_phone, shipping_address, items, notes } = req.body;
  if (!customer_name || !customer_email || !shipping_address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Prices are always looked up server-side — never trust amounts sent by the client.
  const lineItems = [];
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.id);
    if (!product) return res.status(400).json({ error: `Product ${item.id} not found` });
    if (!product.in_stock) return res.status(400).json({ error: `${product.name} is out of stock` });
    const qty = Math.max(1, Math.min(20, Number(item.qty) || 1));
    if (product.stock_qty != null && qty > product.stock_qty) {
      return res.status(400).json({ error: `Only ${product.stock_qty} of ${product.name} left in stock` });
    }
    const images = JSON.parse(product.images || '[]');

    subtotal += product.price * qty;
    orderItems.push({ id: product.id, name: product.name, price: product.price, qty });
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(product.price * 100),
        product_data: {
          name: product.name,
          images: images[0] ? [`${CLIENT_URL}${images[0]}`] : undefined,
        },
      },
    });
  }

  const order_number = 'PAJ-' + uuidv4().slice(0, 8).toUpperCase();
  const total = subtotal;

  db.prepare(`
    INSERT INTO orders (order_number, customer_id, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, total, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(order_number, req.customer?.id || null, customer_name, customer_email, customer_phone || null, JSON.stringify(shipping_address), JSON.stringify(orderItems), subtotal, total, notes || null);

  stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email,
    line_items: lineItems,
    success_url: `${CLIENT_URL}/order-success/${order_number}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${CLIENT_URL}/checkout`,
    metadata: { order_number },
  }).then(session => {
    db.prepare('UPDATE orders SET stripe_session_id = ? WHERE order_number = ?').run(session.id, order_number);
    res.json({ url: session.url, order_number });
  }).catch(err => {
    console.error('Stripe session creation failed:', err.message);
    res.status(502).json({ error: 'Could not start payment session' });
  });
});

module.exports = router;
