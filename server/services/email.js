const { Resend } = require('resend');
const { wrapEmail, button, GOLD_DARK } = require('./emailTemplate');

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

  const html = wrapEmail(`
      <h2 style="margin:0 0 16px;color:${GOLD_DARK};font-size:22px;">You left something beautiful behind</h2>
      <p style="margin:0 0 20px;">Hi ${name || 'there'}, your selections are still saved — complete your order before they're gone.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 24px;border-top:1px solid #ddd;border-bottom:1px solid #ddd;">
        ${rows}
        <tr><td style="padding:12px 0 0;font-weight:bold;">Total</td><td style="padding:12px 0 0;text-align:right;font-weight:bold;">${formatMoney(total)}</td></tr>
      </table>
      ${checkoutUrl
        ? button(checkoutUrl, 'Complete Your Order')
        : `<p style="margin:0;"><a href="${process.env.CLIENT_URL || ''}/shop" style="color:${GOLD_DARK};">Return to the shop</a> to pick up where you left off.</p>`}
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Still thinking it over? Your cart is waiting',
    html,
  });
}

async function sendPasswordResetEmail({ to, name, resetUrl }) {
  if (!resend) return { skipped: 'RESEND_API_KEY not configured' };

  const html = wrapEmail(`
      <h2 style="margin:0 0 16px;color:${GOLD_DARK};font-size:22px;">Reset your password</h2>
      <p style="margin:0 0 24px;">Hi ${name || 'there'}, we received a request to reset your Park Ave Jewelers password. This link expires in 1 hour.</p>
      ${button(resetUrl, 'Reset Password')}
      <p style="margin:24px 0 0;font-size:13px;color:#555;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
  `);

  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Reset your Park Ave Jewelers password',
    html,
  });
}

module.exports = { sendAbandonedCartEmail, sendPasswordResetEmail };
