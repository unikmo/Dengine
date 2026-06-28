import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('events').select('category')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const counts: Record<string, number> = {}
  ;(data || []).forEach((r: any) => {
    counts[r.category] = (counts[r.category] || 0) + 1
  })

  const categories = Object.entries(counts)
    .map(([name, event_count]) => ({ name, event_count }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return NextResponse.json({ categories })
}

