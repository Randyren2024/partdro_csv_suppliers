-- Public catalogue endpoints are exposed through narrow, invoker-security views.
-- Internal supplier notes, contact details, source records and verification metadata
-- remain inaccessible to anon/authenticated roles.
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

drop view if exists public.catalogue_products;
drop view if exists public.catalogue_suppliers;

create view public.catalogue_products
with (security_invoker = true, security_barrier = true)
as
select
  id, slug, name, name_en, model, brand, category, product_type,
  summary, description, specifications, features, applications, media, supplier_id
from public.products
where status = 'published' and slug is not null;

create view public.catalogue_suppliers
with (security_invoker = true, security_barrier = true)
as
select
  s.id, s.name, s.name_en, s.region, s.province, s.city, s.district,
  s.segment, s.category, s.category_label, s.product_models, s.website,
  p.slug, p.address, p.founded_year
from public.suppliers s
left join public.supplier_profiles p on p.supplier_id = s.id
where s.status in ('listed', 'verified');

revoke all on public.products, public.suppliers, public.supplier_profiles from anon, authenticated;
revoke all on public.catalogue_products, public.catalogue_suppliers from anon, authenticated;

grant select (id, slug, name, name_en, model, brand, category, product_type, summary, description, specifications, features, applications, media, supplier_id, status)
on public.products to anon, authenticated;
grant select (id, name, name_en, region, province, city, district, segment, category, category_label, product_models, website, status)
on public.suppliers to anon, authenticated;
grant select (supplier_id, slug, address, founded_year)
on public.supplier_profiles to anon, authenticated;

grant select on public.catalogue_products, public.catalogue_suppliers to anon, authenticated;
