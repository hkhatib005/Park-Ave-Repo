const express = require('express');
const { runAbandonedCartCheck } = require('../jobs/abandonedCart');

const router = express.Router();

// Triggered on a schedule by a Render Cron Job service instead of an
// in-process setInterval — a timer inside the web process doesn't survive
// the host sleeping, a deploy restarting it, or (if this ever runs as
// multiple instances) firing once per instance instead of once total.
// A separate cron *service* can't touch this SQLite file directly (Render
// disks only attach to one service), so it hits this endpoint over HTTP
// instead, authenticated by a shared secret rather than left open on a
// guessable path.
router.post('/abandoned-cart-check', async (req, res) => {
  if (!process.env.INTERNAL_CRON_SECRET || req.headers['x-internal-secret'] !== process.env.INTERNAL_CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    await runAbandonedCartCheck();
    res.json({ ok: true });
  } catch (err) {
    console.error('Abandoned cart job failed:', err.message);
    res.status(500).json({ error: 'Job failed' });
  }
});

module.exports = router;
