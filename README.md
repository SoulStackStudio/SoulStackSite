# Soul Stacked Studio

A 2-page e-commerce site for selling fine-art photo prints. Next.js (App Router) + Tailwind, Stripe Checkout for payments, Resend for automatic order emails to the printer, and a built-in inline admin mode — no external CMS.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The site seeds itself with placeholder content on first load (stored in `data/content.json`).

**Admin mode:** click the small lock icon in the header. The local dev password is `soulstacked` (set in `.env.local`). Once unlocked you can:

- Edit the hero headline/subtext and change the hero image (hover the text → pencil icon)
- Edit the About section and Shop page heading
- On the Shop page: add, edit, delete, and reorder prints (title, description, image upload or URL, featured toggle, sizes + prices)

Changes save instantly. In local dev they go to `data/content.json`; in production they go to Netlify Blobs.

## How orders work

1. Customer picks a print + size → "Buy Print" → hosted Stripe Checkout (collects card + shipping address + phone).
2. Stripe fires a `checkout.session.completed` webhook to `/api/webhooks/stripe`.
3. The webhook emails the full order (print, size, amount, shipping address, customer contact) to `PRINTER_EMAIL` via Resend.
4. If email isn't configured yet, the order is logged to the function logs instead — nothing is lost, and every order is always visible in the Stripe dashboard.

Prices are always read server-side from the content store — the client never sets a price.

## Testing payments locally

1. Put your Stripe **test** keys in `.env.local` (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
2. For webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
3. Buy a print with test card `4242 4242 4242 4242`, any future expiry, any CVC.

## Deploying to Netlify

1. Push this repo to GitHub and "Import from Git" in Netlify — the Next.js build is auto-detected via `netlify.toml`.
2. In Netlify → Site settings → Environment variables, add everything from `.env.example` (use **live** Stripe keys when ready, and a strong `ADMIN_PASSWORD` + random `ADMIN_COOKIE_SECRET`, plus `NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app`).
3. In the Stripe dashboard → Developers → Webhooks: add endpoint `https://your-site.netlify.app/api/webhooks/stripe` for the `checkout.session.completed` event, then copy its signing secret into Netlify as `STRIPE_WEBHOOK_SECRET`.
4. In Resend: add + verify your sending domain (or keep the default `onboarding@resend.dev` sender while testing) and set `PRINTER_EMAIL` to the print shop's address.
5. Redeploy after adding env vars.

Content and uploaded images persist in **Netlify Blobs** automatically — no database or extra services to set up.

## Project layout

```
src/lib/store.ts        # storage adapter: data/*.json locally, Netlify Blobs in prod
src/lib/auth.ts         # admin password check + signed cookie
src/lib/seed.ts         # default site content (first-run)
src/app/api/            # content, auth, upload, images, checkout, stripe webhook
src/components/         # Navbar, Hero, ProductGrid, admin modals, etc.
```
