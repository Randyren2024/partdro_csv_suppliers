import { getSupabase } from '../../utils/supabase'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Supplier slug is required' })
  const db = getSupabase(event)
  const { data: supplier, error } = await db.from('catalogue_suppliers').select('*').eq('slug', slug).maybeSingle()
  if (error) throw createError({ statusCode: 502, statusMessage: 'Unable to load supplier' })
  if (!supplier) throw createError({ statusCode: 404, statusMessage: 'Supplier not found' })
  const { data: products } = await db.from('products').select('id,slug,name,name_en,model,brand,category,summary,media').eq('supplier_id', supplier.id).eq('status', 'published').order('name')
  return { ...supplier, products: products || [] }
})
