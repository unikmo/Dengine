import { createClient } from '@supabase/supabase-js'

function requireUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured.')
  return url
}

export function getServerSupabase() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRole) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured.')
  return createClient(requireUrl(), serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}

// Backwards-compatible alias for any existing server routes that used the previous helper name.
export const createAdminClient = getServerSupabase

export function createServerClient() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured.')
  return createClient(requireUrl(), anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
}
