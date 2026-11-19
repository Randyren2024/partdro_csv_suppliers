import { getSupabase } from '../../utils/supabase'
import { PUBLIC_PRODUCT_FIELDS, withPublicProductSlug } from '../../utils/product'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Supplier slug is required' })

  const db = getSupabase(event)
  const { data: profile, error: profileError } = await db.from('supplier_profiles')
    .select('supplier_id,slug,address,founded_year')
    .eq('slug', slug)
    .maybeSingle()

  if (profileError) throw createError({ statusCode: 502, statusMessage: 'Unable to load supplier profile' })
  if (!profile) throw createError({ statusCode: 404, statusMessage: 'Supplier not found' })

  const [{ data: supplier, error: supplierError }, { data: products, error: productsError }] = await Promise.all([
    db.from('suppliers')
      .select('id,name,name_en,region,province,city,category,category_label,product_models,website,status')
      .eq('id', profile.supplier_id)
      .in('status', ['listed', 'verified'])
      .maybeSingle(),
    db.from('products')
      .select(PUBLIC_PRODUCT_FIELDS)
      .eq('supplier_id', profile.supplier_id)
      .eq('status', 'published')
      .order('name_en', { ascending: true, nullsFirst: false }),
  ])

  if (supplierError || productsError) {
    throw createError({ statusCode: 502, statusMessage: 'Unable to load supplier catalogue' })
  }
  if (!supplier) throw createError({ statusCode: 404, statusMessage: 'Supplier not found' })

  return {
    ...supplier,
    slug: profile.slug,
    address: profile.address,
    founded_year: profile.founded_year,
    products: (products || []).map(withPublicProductSlug),
  }
})
