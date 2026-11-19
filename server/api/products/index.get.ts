import { getSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(48, Math.max(1, Number(query.limit) || 24))
  const db = getSupabase(event)
  let request = db.from('products').select('id,slug,name,name_en,model,brand,category,product_type,summary,description,specifications,features,applications,media,supplier_id', { count: 'exact' }).eq('status', 'published').order('updated_at', { ascending: false })
  if (typeof query.q === 'string' && query.q.trim()) request = request.or(`name.ilike.%${query.q.trim()}%,name_en.ilike.%${query.q.trim()}%,model.ilike.%${query.q.trim()}%,brand.ilike.%${query.q.trim()}%`)
  if (typeof query.category === 'string' && query.category) request = request.eq('category', query.category)
  const { data, error, count } = await request.range((page - 1) * pageSize, page * pageSize - 1)
  if (error) throw createError({ statusCode: 502, statusMessage: 'Unable to load products' })
  return { items: data || [], total: count || 0, page, pageSize }
})
