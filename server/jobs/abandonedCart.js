const db = require('../db/database');
const { sendAbandonedCartEmail } = require('../services/email');

const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const DELAY_MINUTES = Number(process.env.ABANDONED_CART_DELAY_MINUTES) || 60;

// Orders are written the moment someone submits checkout (see server/routes/checkout.js),
// before Stripe redirect — so an unpaid order past the delay window with no follow-up email
// yet is exactly "started checkout, never paid." Bounded to 7 days so a long outage doesn't
// dump a backlog of stale reminders once the job resumes.
async function runAbandonedCartCheck() {
  if (!process.env.RESEND_API_KEY) return;

  const candidates = db.prepare(`
    SELECT * FROM orders
    WHERE payment_status = 'unpaid'
      AND stripe_session_id IS NOT NULL
      AND abandoned_email_sent_at IS NULL
      AND created_at <= datetime('now', ?)
      AND created_at >= datetime('now', '-7 days')
  `).all(`-${DELAY_MINUTES} minutes`);

  for (const order of candidates) {
    let checkoutUrl = null;
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
        if (session.status === 'open') checkoutUrl = session.url;
      } catch (err) {
        console.error(`Abandoned cart: could not retrieve Stripe session for ${order.order_number}:`, err.message);
      }
    }

    try {
      await sendAbandonedCartEmail({
        to: order.customer_email,
        name: order.customer_name,
        items: JSON.parse(order.items),
        total: order.total,
        checkoutUrl,
      });
      db.prepare("UPDATE orders SET abandoned_email_sent_at = datetime('now') WHERE id = ?").run(order.id);
    } catch (err) {
      console.error(`Abandoned cart: failed to send email for ${order.order_number}:`, err.message);
    }
  }
}

module.exports = { runAbandonedCartCheck };
