import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServerSupabase } from '@/lib/supabase-server'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export async function POST() {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (token) {
    const supabase = getServerSupabase()
    await supabase.from('rye_admin_sessions').delete().eq('session_token', token)
  }
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 })
  return response
}
