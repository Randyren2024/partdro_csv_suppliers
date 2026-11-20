import { createClient } from '@supabase/supabase-js'

type SupabaseEvent = Parameters<typeof useRuntimeConfig>[0] & {
  context?: { cloudflare?: { env?: Record<string, string | undefined> } }
  req?: { runtime?: { cloudflare?: { env?: Record<string, string | undefined> } } }
}

export function getSupabase(event: SupabaseEvent) {
  const config = useRuntimeConfig(event)
  // Cloudflare Pages exposes runtime variables on the request context.
  // With nodejs_compat enabled, process.env may not contain Pages bindings.
  const platformEnv = event.context?.cloudflare?.env || event.req?.runtime?.cloudflare?.env || {}
  const url = platformEnv.NUXT_PUBLIC_SUPABASE_URL || config.public.supabaseUrl || process.env.NUXT_PUBLIC_SUPABASE_URL
  const key = platformEnv.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || config.public.supabasePublishableKey || process.env.NUXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw createError({ statusCode: 503, statusMessage: 'Catalogue database is not configured' })
  }

  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
}
