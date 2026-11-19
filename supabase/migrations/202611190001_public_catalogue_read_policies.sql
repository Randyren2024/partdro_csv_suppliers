-- Public catalogue endpoints are deliberately implemented as narrow views.
-- The underlying source tables contain internal verification/research metadata
-- and are not granted to anon/authenticated roles.
drop policy if exists "Public can read published products" on public.products;
drop policy if exists "Public can read listed suppliers" on public.suppliers;
drop policy if exists "Public can read profiles for listed suppliers" on public.supplier_profiles;

create policy "Public can read published products"
on public.products for select to anon, authenticated
using (status = 'published');

create policy "Public can read listed suppliers"
on public.suppliers for select to anon, authenticated
using (status in ('listed', 'verified'));

create policy "Public can read profiles for listed suppliers"
on public.supplier_profiles for select to anon, authenticated
using (
  exists (
    select 1 from public.suppliers s
    where s.id = supplier_profiles.supplier_id
      and s.status in ('listed', 'verified')
  )
);

-- Views use owner privileges (security_invoker is intentionally false) so
-- callers do not need direct SELECT grants on sensitive base tables.
-- security_barrier prevents unsafe predicate pushdown across the view boundary.
create or replace view public.catalogue_products
with (security_barrier = true)
as
select
  id, slug, name, name_en, model, brand, category, product_type,
  summary, description, specifications, features, applications, media, supplier_id
from public.products
where status = 'published' and slug is not null;

create or replace view public.catalogue_suppliers
with (security_barrier = true)
as
select
  s.id, s.name, s.name_en, s.region, s.province, s.city, s.district,
  s.segment, s.category, s.category_label, s.product_models, s.website,
  coalesce(
    p.slug,
    lower(regexp_replace(coalesce(s.name_en, s.name), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || s.id
  ) as slug,
  p.address, p.founded_year,
  jsonb_strip_nulls(jsonb_build_object(
    'displayName', p.profile_data -> 'displayName',
    'description', p.profile_data -> 'description',
    'brand', p.profile_data -> 'brand',
    'category', p.profile_data -> 'category',
    'categoryLabel', p.profile_data -> 'categoryLabel',
    'location', p.profile_data -> 'location',
    'foundedYear', p.profile_data -> 'foundedYear',
    'website', p.profile_data -> 'website'
  )) as public_profile
from public.suppliers s
left join public.supplier_profiles p on p.supplier_id = s.id
where s.status in ('listed', 'verified');

revoke all on public.products, public.suppliers, public.supplier_profiles from anon, authenticated;
grant select on public.catalogue_products, public.catalogue_suppliers to anon, authenticated;
