import { getSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = getSupabase(event)
  let request = db.from('catalogue_suppliers').select('id,name,name_en,region,province,city,category,category_label,product_models,website,slug,address,founded_year,public_profile', { count: 'exact' }).order('name_en', { ascending: true, nullsFirst: false })
  if (typeof query.q === 'string' && query.q.trim()) request = request.or(`name.ilike.%${query.q.trim()}%,name_en.ilike.%${query.q.trim()}%,city.ilike.%${query.q.trim()}%`)
  const { data, error, count } = await request.range(0, 99)
  if (error) throw createError({ statusCode: 502, statusMessage: 'Unable to load suppliers' })
  return { items: data || [], total: count || 0 }
})
