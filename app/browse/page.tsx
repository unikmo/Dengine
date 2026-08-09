'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const ICONS: Record<string, string> = {
  'Corporate & Business': '▦',
  'Trade & Professional': '▤',
  Fundraising: '◇',
  'Hospitality & Food': '◫',
  'Digital & Hybrid': '◉',
  'Education & Youth': '□',
}

export default function BrowsePage() {
  const [categories, setCategories] = useState<{ name: string; event_count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('events')
      .select('category')
      .then(({ data }) => {
        const counts: Record<string, number> = {}
        ;(data || []).forEach((r: { category: string }) => {
          if (r.category) counts[r.category] = (counts[r.category] || 0) + 1
        })
        setCategories(
          Object.entries(counts)
            .map(([name, event_count]) => ({ name, event_count }))
            .sort((a, b) => a.name.localeCompare(b.name))
        )
        setLoading(false)
      })
  }, [])

  return (
    <main className="bg-white min-h-screen">
      <section className="bg-[#f5f0e8] px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Reference Library</p>
          <h1 className="text-4xl font-bold text-navy mb-4">Start from event knowledge, not a blank page.</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Browse the event reference library for inspiration and coverage. The core DEngine product adapts event logic into a tailored execution plan with deadlines, dependencies, risks and approvals.
          </p>
          <a href="/custom" className="inline-block mt-7 bg-navy text-white font-bold text-sm px-6 py-3 rounded-xl">
            Build a tailored execution plan →
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => <div key={i} className="h-28 bg-gray-50 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(cat => (
              <a
                key={cat.name}
                href={`/browse/${encodeURIComponent(cat.name)}`}
                className="rounded-2xl border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-xl text-gold mb-4">{ICONS[cat.name] || '◌'}</div>
                <h2 className="font-bold text-navy mb-1">{cat.name}</h2>
                <p className="text-xs text-gray-400">{cat.event_count} reference event types</p>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
