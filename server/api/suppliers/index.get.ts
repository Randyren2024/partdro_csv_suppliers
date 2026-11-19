import { getSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = getSupabase(event)

  // Keep explicit column grants; do not request exact COUNT(*) from base tables.
  const [{ data: suppliers, error: suppliersError }, { data: profiles, error: profilesError }] = await Promise.all([
    db.from('suppliers')
      .select('id,name,name_en,region,province,city,category,category_label,product_models,website,status')
      .in('status', ['listed', 'verified'])
      .order('name_en', { ascending: true, nullsFirst: false })
      .range(0, 999),
    db.from('supplier_profiles')
      .select('supplier_id,slug,address,founded_year')
      .range(0, 999),
  ])

  if (suppliersError || profilesError) {
    throw createError({ statusCode: 502, statusMessage: 'Unable to load suppliers' })
  }

  const profilesBySupplier = new Map((profiles || []).map((profile: any) => [profile.supplier_id, profile]))
  let items = (suppliers || []).map((supplier: any) => {
    const profile: any = profilesBySupplier.get(supplier.id)
    return {
      ...supplier,
      slug: profile?.slug || null,
      address: profile?.address || null,
      founded_year: profile?.founded_year || null,
    }
  })

  if (typeof query.q === 'string' && query.q.trim()) {
    const term = query.q.trim().slice(0, 80).toLowerCase()
    items = items.filter((supplier: any) =>
      [supplier.name, supplier.name_en, supplier.city, supplier.province]
        .some((value) => String(value || '').toLowerCase().includes(term)),
    )
  }

  return { items, total: items.length }
})
