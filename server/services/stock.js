const db = require('../db/database');

const releaseStock = db.prepare('UPDATE products SET stock_qty = stock_qty + ?, in_stock = 1 WHERE id = ?');
const claimRelease = db.prepare('UPDATE orders SET stock_released = 1 WHERE id = ? AND stock_released = 0');

// Releases the stock reserved for an order (see routes/checkout.js's reserveStock)
// exactly once, no matter which of three independent paths gets there first —
// Stripe's checkout.session.expired webhook, an admin cancelling the order, or
// an admin refunding it. Claiming stock_released atomically means a race
// between any two of those can't double-credit the same units back.
function releaseOrderStock(orderId) {
  const claim = claimRelease.run(orderId);
  if (claim.changes === 0) return false;
  const order = db.prepare('SELECT items FROM orders WHERE id = ?').get(orderId);
  for (const item of JSON.parse(order.items || '[]')) releaseStock.run(item.qty, item.id);
  return true;
}

module.exports = { releaseOrderStock };
