const db = require('../db/database');
const { releaseOrderStock } = require('../services/stock');

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
      const order = db.prepare('SELECT payment_status FROM orders WHERE order_number = ?').get(orderNumber);
      // Stripe may retry this webhook — only apply the paid transition once.
      // Stock was already reserved (decremented) when the session was
      // created — see server/routes/checkout.js — so there's nothing left
      // to decrement here.
      if (order && order.payment_status !== 'paid') {
        db.prepare("UPDATE orders SET payment_status = 'paid', status = 'confirmed', payment_method = 'card' WHERE order_number = ?")
          .run(orderNumber);
      }
    }
  }

  // Fires when a Checkout Session's expires_at passes without payment —
  // releases the stock that create-session reserved for it. Requires this
  // event to be added to the webhook's subscribed events in the Stripe
  // dashboard alongside checkout.session.completed.
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object;
    const orderNumber = session.metadata?.order_number;
    if (orderNumber) {
      const order = db.prepare('SELECT id, payment_status FROM orders WHERE order_number = ?').get(orderNumber);
      // A session can't complete after expiring, but guard against odd event
      // ordering rather than assume it.
      if (order && order.payment_status !== 'paid') {
        db.prepare("UPDATE orders SET payment_status = 'expired' WHERE id = ?").run(order.id);
        releaseOrderStock(order.id);
      }
    }
  }

  res.json({ received: true });
};
