import { createClient } from '@supabase/supabase-js'

// Fallback prevents createClient throwing "supabaseUrl is required" during next build
// when env vars haven't been injected yet. Real values are always present at runtime.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side client (for API routes)
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Admin client bypasses RLS — use only in API routes, never in browser
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.warn('[supabase] SUPABASE_SERVICE_ROLE_KEY not set, falling back to anon key')
    return createServerClient()
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  )
}
