import { cookies } from 'next/headers'
import { getServerSupabase } from '@/lib/supabase-server'

export const ADMIN_COOKIE = 'rye_admin_session'

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return null

  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from('rye_admin_sessions')
    .select('id,admin_user_id,expires_at,rye_admin_users(email)')
    .eq('session_token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error || !data) return null
  return { token, ...data }
}
