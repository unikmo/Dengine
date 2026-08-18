import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase-server'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export async function POST() {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  if (token) {
    const supabase = createServerClient()
    await supabase.rpc('rye_admin_logout', { p_token: token })
  }
  const response = NextResponse.redirect(new URL('/admin/login', 'https://runyourevent.com'), 303)
  response.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 0 })
  return response
}
