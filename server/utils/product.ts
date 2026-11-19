export const PUBLIC_PRODUCT_FIELDS = [
  'id',
  'slug',
  'name',
  'name_en',
  'model',
  'brand',
  'category',
  'product_type',
  'summary',
  'description',
  'specifications',
  'features',
  'applications',
  'media',
  'supplier_id',
].join(',')

type ProductSlugInput = {
  id: string
  slug: string | null
  name: string
  name_en: string | null
}

export function withPublicProductSlug<T extends ProductSlugInput>(product: T) {
  const storedSlug = product.slug?.trim()
  if (storedSlug) return product

  const base = (product.name_en || product.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return {
    ...product,
    slug: `${base || 'product'}-${product.id.replace(/-/g, '').slice(0, 8)}`,
  }
}
