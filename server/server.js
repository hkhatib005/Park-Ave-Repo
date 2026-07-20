require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { UPLOADS_DIR } = require('./config');

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://accounts.google.com', 'https://checkout.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://accounts.google.com'],
      frameSrc: ['https://accounts.google.com', 'https://checkout.stripe.com', 'https://www.google.com'],
      // Same reasoning as hsts below: this directive tells the browser to silently
      // rewrite every http:// asset request on the page to https:// before sending
      // it. Fine once a real proxy terminates TLS in front of us; fatal in local
      // dev, where nothing is listening on https:// and every asset just fails.
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  // HSTS forces the browser to upgrade every future request on this host to HTTPS.
  // This app doesn't terminate TLS itself, so sending it over plain HTTP in local
  // dev makes the browser silently rewrite the next asset request to https:// —
  // which has nothing listening — leaving a blank page. Only send it once we're
  // actually running in production behind a proxy that terminates TLS.
  hsts: process.env.NODE_ENV === 'production',
}));
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Stripe webhook needs the raw request body for signature verification,
// so it must be registered before the global express.json() parser.
app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }), require('./routes/checkoutWebhook'));

app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(UPLOADS_DIR));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/account', require('./routes/account'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin/customers', require('./routes/adminCustomers'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/internal', require('./routes/internal'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Serve built React frontend in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => res.sendFile(path.join(clientDist, 'index.html')));

app.listen(PORT, () => console.log(`Park Ave Jewelers running on port ${PORT}`));

// The abandoned-cart check runs on a schedule via a separate Render Cron Job
// service hitting POST /api/internal/abandoned-cart-check (see render.yaml
// and routes/internal.js) — not an in-process timer, which wouldn't survive
// the host sleeping, a deploy restarting it, or ever running as more than
// one instance.
