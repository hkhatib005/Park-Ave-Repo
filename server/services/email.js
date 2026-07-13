const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
// Falls back to Resend's shared sandbox address, which only delivers to the
// email your Resend account is registered with — fine for testing, not for real customers.
const FROM = process.env.EMAIL_FROM || 'Park Ave Jewelers <onboarding@resend.dev>';

function formatMoney(n) {
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

async function sendAbandonedCartEmail({ to, name, items, total, checkoutUrl }) {
  if (!resend) return { skipped: 'RESEND_API_KEY not configured' };

  const rows = items.map(i => `
    <tr>
      <td style="padding:8px 0;color:#333;">${i.name} ${i.qty > 1 ? `× ${i.qty}` : ''}</td>
      <td style="padding:8px 0;text-align:right;color:#333;">${formatMoney(i.price * i.qty)}</td>
    </tr>`).join('');

  const html = `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;color:#1a1a1a;">
      <h2 style="color:#8a6d1f;">You left something beautiful behind</h2>
      <p>Hi ${name || 'there'}, your selections are still saved — complete your order before they're gone.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;border-top:1px solid #ddd;border-bottom:1px solid #ddd;">
        ${rows}
        <tr><td style="padding:12px 0 0;font-weight:bold;">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:bold;">${formatMoney(total)}</td></tr>
      </table>
      ${checkoutUrl
        ? `<a href="${checkoutUrl}" style="display:inline-block;background:#8a6d1f;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;">Complete Your Order</a>`
        : `<p><a href="${process.env.CLIENT_URL || ''}/shop">Return to the shop</a> to pick up where you left off.</p>`}
      <p style="margin-top:32px;font-size:12px;color:#888;">Park Ave Jewelers &middot; 25 W 47th St, Booth #8, New York, NY 10036</p>
    </div>`;

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Still thinking it over? Your cart is waiting',
    html,
  });
}

module.exports = { sendAbandonedCartEmail };
