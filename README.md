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

The application reads the public catalogue views:

- `catalogue_products`: published products only
- `catalogue_suppliers`: listed/verified suppliers only

The migration in `supabase/migrations` documents the RLS policies, column-level grants and invoker-security views. Internal supplier notes, contact details, source records and product verification metadata are not exposed to anonymous visitors.

## Deployment

Cloudflare Pages project: `partdro-products`

- Production branch: `main`
- Build command: `NITRO_PRESET=cloudflare_pages npm run build`
- Output directory: `dist`
- Preview deployments: enabled for non-main branches
- Production deployments: enabled on `main`

Cloudflare Pages is connected directly to this GitHub repository, so no Cloudflare API token is needed in GitHub Actions.

Never put a Supabase service-role key in client-side code or public environment variables.
