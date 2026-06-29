import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('events').select('category')

    console.log('[browse-categories] rows:', data?.length ?? 'null', 'error:', error?.message ?? 'none')

    if (error) {
      return NextResponse.json({ error: error.message, categories: [] })
    }

    const counts: Record<string, number> = {}
    ;(data || []).forEach((r: any) => {
      if (r.category) counts[r.category] = (counts[r.category] || 0) + 1
    })

    const categories = Object.entries(counts)
      .map(([name, event_count]) => ({ name, event_count }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({ categories })
  } catch (err: any) {
    console.error('[browse-categories] CRASH:', err?.message, err?.stack)
    return NextResponse.json({ error: err?.message ?? 'unknown crash', categories: [] }, { status: 500 })
  }
}
