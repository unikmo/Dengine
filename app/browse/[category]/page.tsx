'use client'
import { useEffect, useState } from 'react'
import { ChevronRight, Clock, Users, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/types'

const COMPLEXITY_STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    supabase.from('events').select('*').eq('category', category).order('complexity').then(({ data }) => {
      if (data) setEvents(data)
      setLoading(false)
    })
  }, [category])

  const subcategories = ['all', ...Array.from(new Set(events.map(e => e.subcategory)))]
  const filtered = filter === 'all' ? events : events.filter(e => e.subcategory === filter)

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-navy">Home</a>
        <ChevronRight size={14} />
        <span className="text-navy font-medium">{category}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">{category}</h1>
          <p className="text-gray-500 mt-1">{events.length} events in this category</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {subcategories.map(sub => (
            <button key={sub} onClick={() => setFilter(sub)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === sub ? 'bg-navy text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy/30'
              }`}>
              {sub === 'all' ? 'All' : sub}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-3 w-3/4" />
              <div className="h-3 bg-gray-100 rounded mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(event => (
            <a key={event.id} href={`/events/${event.id}`}
              className="card p-5 hover:border-navy/20 group">
              <div className="flex items-start justify-between mb-2">
                <span className="badge bg-gray-100 text-gray-600 text-xs">{event.subcategory}</span>
                {event.has_tasks && (
                  <span className="badge bg-green-100 text-green-700 text-xs">✓ Ready</span>
                )}
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-navy transition-colors mb-1">
                {event.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
                <span className="flex items-center gap-1">
                  <Users size={11} /> {event.scale}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star size={11} fill="currentColor" /> {COMPLEXITY_STARS(event.complexity)}
                </span>
                {event.planning_weeks > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {event.planning_weeks}w
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}
