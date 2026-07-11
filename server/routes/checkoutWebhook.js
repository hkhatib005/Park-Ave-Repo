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
      db.prepare("UPDATE orders SET payment_status = 'paid', status = 'confirmed', payment_method = 'card' WHERE order_number = ?")
        .run(orderNumber);
    }
  }

  res.json({ received: true });
};
