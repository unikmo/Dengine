import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('[browse-categories] missing env vars', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey })
      return NextResponse.json({ error: 'missing env', categories: [] }, { status: 500 })
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/events?select=category`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('[browse-categories] REST error', res.status, text)
      return NextResponse.json({ error: text, categories: [] }, { status: 500 })
    }

    const data: { category: string }[] = await res.json()
    console.log('[browse-categories] rows:', data.length)

    const counts: Record<string, number> = {}
    data.forEach(r => {
      if (r.category) counts[r.category] = (counts[r.category] || 0) + 1
    })

    const categories = Object.entries(counts)
      .map(([name, event_count]) => ({ name, event_count }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ categories })
  } catch (err: any) {
    console.error('[browse-categories] crash:', err?.message)
    return NextResponse.json({ error: err?.message, categories: [] }, { status: 500 })
  }
}
