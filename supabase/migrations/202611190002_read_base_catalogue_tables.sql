-- The Nuxt catalogue now reads the public base tables through server API routes.
-- Keep the supplier catalogue views removed so the app has one explicit data path.
DROP VIEW IF EXISTS public.catalogue_products;
DROP VIEW IF EXISTS public.catalogue_suppliers;
