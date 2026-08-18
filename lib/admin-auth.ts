import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'

export const ADMIN_COOKIE = 'rye_admin_session'

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return null

  const supabase = createServerClient()
  const { data, error } = await supabase.rpc('rye_admin_session_valid', { p_token: token })
  if (error || data !== true) return null
  return { token }
}
