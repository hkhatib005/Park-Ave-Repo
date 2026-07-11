const crypto = require('crypto');

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"');
  }
  console.warn('JWT_SECRET not set — using an ephemeral dev secret. Set JWT_SECRET in .env before deploying.');
}

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(48).toString('hex'),
};
