import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy singleton — createClient is never called at module load time,
// only on first actual use. This prevents build crashes during Next.js
// "collect page data" / static export phases where env vars may not
// be injected yet, and avoids supabase-js URL validation throwing.
let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop: string) {
    const client = getClient()
    const value = (client as any)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
