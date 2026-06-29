'use client'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/types'

export default function CategoryPage({ params }: { params: { category: string } }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const category = decodeURIComponent(params.category)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('category', category)
      .order('name')
      .then(({ data }) => {
        setEvents(data || [])
        setLoading(false)
      })
  }, [category])

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <a href="/browse" className="hover:text-navy transition-colors">Browse</a>
        <ChevronRight size={14} />
        <span className="text-navy font-medium">{category}</span>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-navy mb-2">{category}</h1>
        {!loading && (
          <p className="text-gray-400 text-sm">{events.length} event blueprints</p>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">No blueprints in this category yet.</p>
          <a href="/custom" className="text-navy font-medium hover:underline text-sm">
            Describe your event and we'll build the blueprint →
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          {events.map(ev => (
            <a
              key={ev.id}
              href={`/events/${ev.id}`}
              className="bg-white rounded-xl px-5 py-4 flex items-center justify-between border border-transparent hover:border-gray-200 hover:shadow-sm transition-all group"
            >
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-navy transition-colors text-sm mb-0.5">
                  {ev.name}
                </div>
                <div className="text-xs text-gray-400">{ev.subcategory} · {ev.scale}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {ev.has_tasks && (
                  <span className="text-xs bg-green-50 text-green-600 font-medium px-2.5 py-1 rounded-full">
                    Blueprint ready
                  </span>
                )}
                <ChevronRight size={15} className="text-gray-300 group-hover:text-navy transition-colors" />
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-14 text-center">
        <p className="text-sm text-gray-400 mb-3">Don't see what you need?</p>
        <a href="/custom" className="text-navy font-semibold text-sm hover:underline">
          Build a custom blueprint →
        </a>
      </div>
    </main>
  )
}
