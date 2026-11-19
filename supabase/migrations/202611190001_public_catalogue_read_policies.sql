-- Public read access for the storefront. Internal supplier research notes and
-- contact fields are deliberately excluded from the public view.
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

create or replace view public.catalogue_suppliers
with (security_invoker = true)
as
select
  s.id, s.name, s.name_en, s.region, s.province, s.city, s.district,
  s.segment, s.category, s.category_label, s.product_models, s.website,
  p.slug, p.address, p.founded_year,
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

grant select on public.products to anon, authenticated;
grant select on public.suppliers to anon, authenticated;
grant select on public.catalogue_suppliers to anon, authenticated;
