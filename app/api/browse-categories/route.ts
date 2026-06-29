import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from('events').select('category')

  console.log('[browse-categories] rows:', data?.length, 'error:', error?.message)

  if (error) {
    // Try categories table as fallback
    const { data: catData, error: catError } = await supabase.from('categories').select('*')
    console.log('[browse-categories] fallback rows:', catData?.length, 'error:', catError?.message)

    if (catError || !catData?.length) {
      return NextResponse.json({ error: error.message, fallbackError: catError?.message }, { status: 500 })
    }

    return NextResponse.json({
      categories: catData.map((c: any) => ({ name: c.name, event_count: c.event_count ?? 0 })),
    })
  }

  if (!data || data.length === 0) {
    return NextResponse.json({ categories: [], debug: 'events table returned 0 rows' })
  }

  const counts: Record<string, number> = {}
  data.forEach((r: any) => {
    if (r.category) counts[r.category] = (counts[r.category] || 0) + 1
  })

  const categories = Object.entries(counts)
    .map(([name, event_count]) => ({ name, event_count }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return NextResponse.json({ categories })
}
