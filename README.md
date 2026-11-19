# Partdro Products

Independent Nuxt 4 product and supplier directory powered by the Partdro Supabase catalogue.

## Stack

- Nuxt 4 / Vue 3 / TypeScript
- Supabase PostgreSQL as the source of truth
- Cloudflare Pages with Git integration

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Set these public runtime variables in `.env`:

- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Data model

The application reads the base tables through Nuxt server API routes; it does not depend on the optional `catalogue_products` or `catalogue_suppliers` views.

- `products`: published supplier product records, filtered by the `status = 'published'` RLS policy.
- `suppliers`: listed or verified supplier records.
- `supplier_profiles`: public supplier profile fields joined by `supplier_id`.
- `products.supplier_id` references `suppliers.id`; supplier profiles reference the same supplier key.

The server routes use only the public publishable key and explicit public-column projections. Row-level security and column-level grants remain enforced by Supabase. Internal supplier notes, contact details, source records and product verification metadata are not returned to anonymous visitors. Never put a Supabase service-role key in client-side code or public environment variables.

## Deployment

Cloudflare Pages project: `partdro-products`

- Production branch: `main`
- Build command: `NITRO_PRESET=cloudflare_pages npm run build`
- Output directory: `dist`
- Preview deployments: enabled for non-main branches
- Production deployments: enabled on `main`

Cloudflare Pages is connected directly to this GitHub repository, so no Cloudflare API token is needed in GitHub Actions.
