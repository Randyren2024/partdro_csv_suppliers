import { createClient } from '@supabase/supabase-js'

export function getSupabase(event: Parameters<typeof useRuntimeConfig>[0]) {
  const config = useRuntimeConfig(event)
  const url = config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL
  const key = config.public.supabasePublishableKey || process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw createError({ statusCode: 503, statusMessage: 'Catalogue database is not configured' })
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
