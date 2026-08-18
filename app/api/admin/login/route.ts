import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = typeof body?.email === 'string' ? body.email.trim().slice(0, 200) : ''
    const password = typeof body?.password === 'string' ? body.password : ''
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })

    const supabase = createServerClient()
    const { data, error } = await supabase.rpc('rye_admin_login', { p_email: email, p_password: password })
    const row = Array.isArray(data) ? data[0] : data
    if (error || !row?.session_token) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })

    const response = NextResponse.json({ ok: true })
    response.cookies.set(ADMIN_COOKIE, row.session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(row.expires_at),
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 })
  }
}
