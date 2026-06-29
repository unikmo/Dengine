'use client'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/types'

const SCALE_RANGE: Record<string, string> = {
  Intimate: '15–50 people',
  Medium: '50–500 people',
  Large: '500–5,000 people',
  Mega: '5,000+ people',
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const category = decodeURIComponent(params.category)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('category', category)
      .eq('has_tasks', true)
      .order('name')
      .then(({ data }) => {
        setEvents(data || [])
        setLoading(false)
      })
  }, [category])

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <a href="/browse" className="hover:text-navy transition-colors">Browse</a>
        <ChevronRight size={14} />
        <span className="text-navy font-medium">{category}</span>
      </div>

      <h1 className="text-3xl font-bold text-navy mb-1">{category}</h1>
      {!loading && (
        <p className="text-gray-400 text-sm mb-10">{events.length} blueprints ready</p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No blueprints ready for this category yet.</p>
          <a href="/custom" className="text-navy font-medium hover:underline text-sm">
            Describe your event and we'll build one →
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <a
              key={ev.id}
              href={`/events/${ev.id}`}
              className="bg-white rounded-2xl px-6 py-5 flex items-center justify-between border border-transparent hover:border-gray-200 hover:shadow-sm transition-all group block"
            >
              <div className="flex-1 min-w-0 pr-6">
                <div className="font-semibold text-gray-900 group-hover:text-navy transition-colors mb-2">
                  {ev.name}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                  <span>{ev.subcategory}</span>
                  <span>·</span>
                  <span>{ev.scale} <span className="text-gray-300">({SCALE_RANGE[ev.scale]})</span></span>
                  <span>·</span>
                  <span>{'★'.repeat(ev.complexity)}{'☆'.repeat(5 - ev.complexity)}</span>
                  <span>·</span>
                  <span>Plan {ev.planning_weeks === 0 ? 'anytime' : `${ev.planning_weeks}w ahead`}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-navy font-semibold border border-navy/20 bg-navy/5 px-3 py-1.5 rounded-lg group-hover:bg-navy group-hover:text-white transition-all">
                  See tasks →
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-14 text-center">
        <p className="text-sm text-gray-400 mb-3">Need something more specific?</p>
        <a href="/custom" className="text-navy font-semibold text-sm hover:underline">
          Build a custom blueprint →
        </a>
      </div>
    </main>
  )
}
