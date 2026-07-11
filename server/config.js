const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production. Generate one with: node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"');
  }
  console.warn('JWT_SECRET not set — using an ephemeral dev secret. Set JWT_SECRET in .env before deploying.');
}

// UPLOADS_DIR lets uploaded images live on a mounted persistent disk in production
// (e.g. Render's ephemeral filesystem wipes local files on every redeploy).
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(48).toString('hex'),
  UPLOADS_DIR,
};
