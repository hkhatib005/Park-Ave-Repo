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

## Apple Sign In

Not wired up yet — it requires an active Apple Developer Program membership ($99/yr) plus domain
verification, which can't be provisioned same-day. The button exists in the UI
(`client/src/components/AppleSignInButton.jsx`) as a disabled placeholder so the layout is ready.
To enable later: mirror `server/routes/account.js`'s `/google` handler with an `/apple` handler that
verifies Apple's identity token, and swap in Apple's JS SDK in the button component.

## Payments model

Checkout uses Stripe's hosted Checkout page (redirect-based) — no card data ever touches this
server, so PCI scope stays minimal. Prices are always looked up server-side from the product
table; the client only ever sends product IDs and quantities, never prices, so a tampered request
can't check out at a discount.

Admins can also manually mark an order `paid` / `unpaid` / `refunded` in **Orders → Payment** for
phone/wire orders that don't go through Stripe.

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
