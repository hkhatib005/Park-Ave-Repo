const db = require('../db/database');

const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

module.exports = (req, res) => {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return res.status(503).end();

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send('Invalid signature');
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderNumber = session.metadata?.order_number;
    if (orderNumber) {
      const order = db.prepare('SELECT items, payment_status FROM orders WHERE order_number = ?').get(orderNumber);
      // Stripe may retry this webhook — only decrement stock the first time this order is marked paid.
      if (order && order.payment_status !== 'paid') {
        db.prepare("UPDATE orders SET payment_status = 'paid', status = 'confirmed', payment_method = 'card' WHERE order_number = ?")
          .run(orderNumber);

        const decrementStock = db.prepare(
          "UPDATE products SET stock_qty = MAX(0, stock_qty - ?), in_stock = CASE WHEN stock_qty - ? <= 0 THEN 0 ELSE in_stock END WHERE id = ?"
        );
        for (const item of JSON.parse(order.items || '[]')) {
          decrementStock.run(item.qty, item.qty, item.id);
        }
      }
    }
  }

  res.json({ received: true });
};
