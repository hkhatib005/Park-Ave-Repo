# Park Ave Jewelers

Full-stack storefront: React + Vite client, Express + SQLite server, Stripe Checkout, Google Sign-In, and an admin dashboard.

## Local development

```bash
# server
cd server && cp .env.example .env   # fill in values, see below
npm install
npm run dev                          # http://localhost:5001

# client (separate terminal)
cd client && cp .env.example .env   # fill in VITE_GOOGLE_CLIENT_ID
npm install
npm run dev                          # http://localhost:5173, proxies /api to :5001
```

On first boot the server seeds 16 sample products and one admin account. If `ADMIN_PASSWORD`
isn't set in `.env`, a random password is generated and printed **once** to the server console —
copy it immediately, it is never shown again or stored anywhere else.

## Required before going live

| What | Where to get it | Used for |
|---|---|---|
| `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` | Signing admin/customer login tokens |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Pick your own | Admin dashboard login |
| `STRIPE_SECRET_KEY` | [stripe.com](https://dashboard.stripe.com/apikeys) → Developers → API keys | Charging customers via Stripe Checkout |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Developers → Webhooks → add endpoint `https://yourdomain.com/api/checkout/webhook` for event `checkout.session.completed` | Confirming payment succeeded, marking orders paid |
| `GOOGLE_CLIENT_ID` (server) + `VITE_GOOGLE_CLIENT_ID` (client, same value) | [console.cloud.google.com](https://console.cloud.google.com/apis/credentials) → OAuth client ID → Web application. Add your domain + `http://localhost:5173` to Authorized JavaScript origins | "Sign in with Google" |
| `CLIENT_URL` | Your production domain | CORS + Stripe redirect URLs |

Without `STRIPE_SECRET_KEY` set, checkout returns a clear "payments not configured" error instead
of crashing. Without `GOOGLE_CLIENT_ID`, the Google button renders as a disabled placeholder.

## Deploying on Render (or any host with ephemeral disk)

Render's free web services wipe local disk on every redeploy — that includes the SQLite database
(`server/db/park_ave.db`) and any images uploaded through the admin panel. **On the free tier this
means every redeploy loses all products, orders, and customer accounts.**

To fix it:
1. Upgrade to a paid instance type (Starter or higher) — free instances can't attach a disk at all.
2. In the Render dashboard, add a **Disk** to the service (1 GB is plenty for a SQLite file + product
   photos), mounted at e.g. `/var/data`.
3. Set these env vars to point at that mount:
   ```
   DB_PATH=/var/data/park_ave.db
   UPLOADS_DIR=/var/data/uploads
   ```
4. Redeploy. The server creates those paths automatically if they don't exist.

Without `DB_PATH` / `UPLOADS_DIR` set, both default to folders inside `server/` — fine for local dev,
not safe for production on ephemeral hosting.

## Payments model

Checkout uses Stripe's hosted Checkout page (redirect-based) — no card data ever touches this
server, so PCI scope stays minimal. Prices are always looked up server-side from the product
table; the client only ever sends product IDs and quantities, never prices, so a tampered request
can't check out at a discount.

Admins can also manually mark an order `paid` / `unpaid` / `refunded` in **Orders → Payment** for
phone/wire orders that don't go through Stripe.

## Abandoned-cart emails

Every checkout attempt writes an `orders` row (with the customer's email) before redirecting to
Stripe, whether or not they finish paying. A background job (`server/jobs/abandonedCart.js`) checks
every 15 minutes for orders that are still `unpaid` an hour after checkout was started
(`ABANDONED_CART_DELAY_MINUTES` in `.env`), and emails a reminder via [Resend](https://resend.com)
with a link back to the still-open Stripe Checkout session if one exists, or the shop otherwise.
Each order is only emailed once (`abandoned_email_sent_at`), and orders older than 7 days are never
retried, so a restart or outage can't cause a backlog of stale reminders.

Requires `RESEND_API_KEY` in `.env`. `EMAIL_FROM` must be an address on a domain verified in Resend
(Domains → Add Domain, then add the DNS records at your registrar) — until that's done, it falls
back to Resend's shared sandbox address, which only delivers to the email your Resend account is
registered with.

## Admin dashboard

`/admin` — login, then:
- **Products** — add/edit/delete inventory, upload images
- **Orders & Payments** — order status + payment status, per order
- **Customer Accounts** — everyone who's registered/signed in with Google, with order totals
- **Client Messages** — contact form submissions, with a one-click mailto reply

## Security notes

- Admin/customer JWTs are separate roles; a customer token cannot hit admin-only routes (and vice versa).
- Rate limiting on login, registration, contact form, and checkout endpoints.
- Helmet CSP, upload MIME/extension allow-listing, parameterized SQL everywhere.
- No default credentials are ever hardcoded or displayed in the UI — see the console-print behavior above.
