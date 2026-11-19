import { getSupabase } from '../../utils/supabase'
import { PUBLIC_PRODUCT_FIELDS, withPublicProductSlug } from '../../utils/product'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Product slug is required' })

  const db = getSupabase(event)
  const { data: exactProduct, error: productError } = await db.from('products')
    .select(PUBLIC_PRODUCT_FIELDS)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (productError) throw createError({ statusCode: 502, statusMessage: 'Unable to load product' })

  let product: any = exactProduct
  if (!product) {
    // A small number of published legacy records have no stored slug.
    // Match the same deterministic fallback used by the listing endpoint.
    const { data: candidates, error: candidatesError } = await db.from('products')
      .select(PUBLIC_PRODUCT_FIELDS)
      .eq('status', 'published')
    if (candidatesError) throw createError({ statusCode: 502, statusMessage: 'Unable to load product' })
    product = (candidates || [])
      .map((item: any) => withPublicProductSlug(item))
      .find((item: any) => item.slug === slug) || null
  }

  if (!product) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  product = withPublicProductSlug(product)

  const [{ data: supplier, error: supplierError }, { data: profile, error: profileError }] = await Promise.all([
    db.from('suppliers')
      .select('id,name,name_en,city,province,region')
      .eq('id', product.supplier_id)
      .in('status', ['listed', 'verified'])
      .maybeSingle(),
    db.from('supplier_profiles')
      .select('slug')
      .eq('supplier_id', product.supplier_id)
      .maybeSingle(),
  ])

  if (supplierError || profileError) {
    throw createError({ statusCode: 502, statusMessage: 'Unable to load supplier information' })
  }

  return {
    ...product,
    supplier: supplier ? { ...supplier, slug: profile?.slug || null } : null,
  }
})
