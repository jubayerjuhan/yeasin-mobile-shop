# yeasin-mobile-shop

Next.js tech e-commerce storefront for Yeasin Mobile Shop, a mobile phone and premium accessories shop in Nawabgonj, Dhaka.

## Development

Run the local app with:

```bash
npm install
npm run dev
```

## Stripe setup

Create `.env.local` from `.env.example` and add your Stripe values:

```bash
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
```

## Admin panel

Open `/admin` for store management:

- `/admin/products` to create, edit, and delete products
- `/admin/categories` to manage categories
- `/admin/orders` to see checkout orders and update fulfillment status

## Order tracking

Orders are created when Stripe checkout sessions are created. Payment status is refreshed when the customer returns to the Stripe success page. For production-grade background syncing, add a Stripe webhook later so paid orders update even if the customer never returns to the site.
