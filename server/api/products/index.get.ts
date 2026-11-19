import { getSupabase } from '../../utils/supabase'
import { PUBLIC_PRODUCT_FIELDS, withPublicProductSlug } from '../../utils/product'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Math.max(1, Number(query.page) || 1)
  const pageSize = Math.min(48, Math.max(1, Number(query.limit) || 24))
  const db = getSupabase(event)

  // Use explicit column-level grants. Avoid PostgREST exact-count requests:
  // COUNT(*) requires table-level SELECT, which would expose private columns.
  const { data, error } = await db.from('products')
    .select(PUBLIC_PRODUCT_FIELDS)
    .eq('status', 'published')
    .order('name_en', { ascending: true, nullsFirst: false })
    .range(0, 999)

  if (error) throw createError({ statusCode: 502, statusMessage: 'Unable to load products' })

  let items = (data || []).map((item: any) => withPublicProductSlug(item))
  if (typeof query.q === 'string' && query.q.trim()) {
    const term = query.q.trim().slice(0, 80).toLowerCase()
    items = items.filter((item: any) =>
      [item.name, item.name_en, item.model, item.brand]
        .some((value) => String(value || '').toLowerCase().includes(term)),
    )
  }
  if (typeof query.category === 'string' && query.category) {
    const category = query.category.slice(0, 40).toLowerCase()
    items = items.filter((item: any) => String(item.category || '').toLowerCase().includes(category))
  }

  const total = items.length
  const start = (page - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
  }
})
