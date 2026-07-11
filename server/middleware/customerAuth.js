const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function verify(req) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return payload.role === 'customer' ? payload : null;
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
