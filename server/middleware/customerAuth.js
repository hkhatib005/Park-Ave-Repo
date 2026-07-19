const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../config');

// Checked against the DB on every request (not just signature/expiry) so a
// password reset or an account deletion can actually kill outstanding
// tokens instead of leaving them valid for their full 30-day lifetime.
function verify(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'customer') return null;
    const row = db.prepare('SELECT token_version FROM customers WHERE id = ?').get(payload.id);
    if (!row || row.token_version !== payload.tokenVersion) return null;
    return payload;
  } catch {
    return null;
  }
}

// Required: rejects the request if there's no valid customer token.
function customerAuth(req, res, next) {
  const payload = verify(req);
  if (!payload) return res.status(401).json({ error: 'Please sign in' });
  req.customer = payload;
  next();
}

// Optional: attaches req.customer if a valid token is present, otherwise continues as guest.
function optionalCustomerAuth(req, res, next) {
  req.customer = verify(req);
  next();
}

module.exports = { customerAuth, optionalCustomerAuth };
