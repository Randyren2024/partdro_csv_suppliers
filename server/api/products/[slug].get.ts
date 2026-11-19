import { getSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Product slug is required' })
  const db = getSupabase(event)
  const { data, error } = await db.from('products').select('id,slug,name,name_en,model,brand,category,product_type,summary,description,specifications,features,applications,media,documents,source_url,source_urls,supplier_id,verification_status').eq('slug', slug).eq('status', 'published').maybeSingle()
  if (error) throw createError({ statusCode: 502, statusMessage: 'Unable to load product' })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  const { data: supplier } = await db.from('catalogue_suppliers').select('id,name,name_en,city,province,website,slug,public_profile').eq('id', data.supplier_id).maybeSingle()
  return { ...data, supplier }
})
