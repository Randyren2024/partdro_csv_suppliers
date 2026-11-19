import { getSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = getSupabase(event)

  let request = db.from('suppliers')
    .select('id,name,name_en,region,province,city,category,category_label,product_models,website,status', { count: 'exact' })
    .in('status', ['listed', 'verified'])
    .order('name_en', { ascending: true, nullsFirst: false })

  if (typeof query.q === 'string' && query.q.trim()) {
    const term = query.q.trim().slice(0, 80).replace(/[,%()]/g, ' ').replace(/\s+/g, ' ')
    request = request.or(`name.ilike.%${term}%,name_en.ilike.%${term}%,city.ilike.%${term}%`)
  }

  const [{ data: suppliers, error: suppliersError, count }, { data: profiles, error: profilesError }] = await Promise.all([
    request.range(0, 249),
    db.from('supplier_profiles').select('supplier_id,slug,address,founded_year'),
  ])

  if (suppliersError || profilesError) {
    throw createError({ statusCode: 502, statusMessage: 'Unable to load suppliers' })
  }

  const profilesBySupplier = new Map((profiles || []).map((profile: any) => [profile.supplier_id, profile]))
  const items = (suppliers || []).map((supplier: any) => {
    const profile: any = profilesBySupplier.get(supplier.id)
    return {
      ...supplier,
      slug: profile?.slug || null,
      address: profile?.address || null,
      founded_year: profile?.founded_year || null,
    }
  })

  return { items, total: count || 0 }
})
