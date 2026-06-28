'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const ICONS: Record<string, string> = {
  'Social & Life': '🎉',
  'Corporate & Business': '💼',
  'Education & Youth': '📚',
  'Arts & Entertainment': '🎭',
  'Sports & Fitness': '🏆',
  'Civic & Community': '🤝',
  'Religious & Spiritual': '✨',
  'Niche & Subculture': '🎲',
  'Cultural & Diaspora': '🌍',
  'Government & Political': '🏛️',
  'Health & Medical': '❤️',
  Fundraising: '💛',
  'Volunteer-Driven': '🙌',
  'Hospitality & Food': '🍽️',
  'Agriculture & Rural': '🌾',
  'Military & Veterans': '🎖️',
  'Media & Creative': '🎬',
  'Trade & Professional': '🤝',
  'Social Causes': '🌱',
  'Heritage & History': '🏺',
  'Water Events': '🌊',
  'Adventure & Extreme': '⛰️',
  'Motorsport & Automotive': '🏎️',
  'Animal Events': '🐾',
  Equestrian: '🐴',
  Seasonal: '🌸',
  'Digital & Hybrid': '💻',
}

export default function BrowsePage() {
  const [categories, setCategories] = useState<{ name: string; event_count: number }[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/browse-categories')
        const json = await res.json()
        if (res.ok && json?.categories) setCategories(json.categories)
        else console.error('[browse] categories fetch failed', json)
      } catch (e) {
        console.error('[browse] categories fetch error', e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    async function load() {
      if (!selected) {
        setEvents([])
        return
      }

      try {
        const res = await fetch(`/api/browse-events?category=${encodeURIComponent(selected)}`)
        const json = await res.json()
        if (res.ok && json?.events) setEvents(json.events)
        else console.error('[browse] events fetch failed', json)
      } catch (e) {
        console.error('[browse] events fetch error', e)
      }
    }

    load()
  }, [selected])

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-navy mb-2">Browse Events</h1>
        <p className="text-gray-500">
          266 event types across 27 categories — click a category to see all events
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelected(selected === cat.name ? null : cat.name)}
              className={`rounded-2xl p-5 text-center transition-all border-2 ${
                selected === cat.name
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-100 bg-white hover:border-navy/30 hover:shadow-md'
              }`}
            >
              <div className="text-3xl mb-2">{ICONS[cat.name] || '📋'}</div>
              <div className="font-semibold text-sm leading-tight mb-1">{cat.name}</div>
              <div className={`text-xs ${selected === cat.name ? 'text-white/70' : 'text-gray-400'}`}>
                {cat.event_count} events
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && events.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-navy mb-6">{selected}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {events.map(ev => (
              <a
                key={ev.id}
                href={`/events/${ev.id}`}
                className="bg-white rounded-xl border border-gray-100 p-5 hover:border-navy/20 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-gray-400">{ev.subcategory}</span>
                  {ev.has_tasks && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      Ready
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-navy transition-colors">
                  {ev.name}
                </h3>
                <p className="text-xs text-gray-500 mt-2">
                  {ev.scale} · {ev.planning_weeks > 0 ? ev.planning_weeks + 'w planning' : 'Anytime'}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {selected && events.length === 0 && (
        <div className="mt-10 text-center text-gray-400 py-12">Loading events...</div>
      )}

      <div className="mt-16 bg-navy text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Not finding what you need?</h2>
        <p className="text-white/70 mb-6">Describe any event and Dengine builds the blueprint.</p>
        <a
          href="/custom"
          className="bg-gold text-navy px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition-colors inline-block"
        >
          Build a custom blueprint
        </a>
      </div>
    </main>
  )
}

