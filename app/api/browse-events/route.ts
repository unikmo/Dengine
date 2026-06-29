import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')

  if (!category) return NextResponse.json({ error: 'Missing category' }, { status: 400 })

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'missing env', events: [] }, { status: 500 })
    }

    const encoded = encodeURIComponent(category)
    const res = await fetch(
      `${supabaseUrl}/rest/v1/events?category=eq.${encoded}&select=*&order=name`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: 'no-store',
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error('[browse-events] REST error', res.status, text)
      return NextResponse.json({ error: text, events: [] }, { status: 500 })
    }

    const events = await res.json()
    return NextResponse.json({ events })
  } catch (err: any) {
    console.error('[browse-events] crash:', err?.message)
    return NextResponse.json({ error: err?.message, events: [] }, { status: 500 })
  }
}
