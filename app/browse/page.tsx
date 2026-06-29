'use client'
import { useEffect, useState } from 'react'

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
  const [eventsLoading, setEventsLoading] = useState(false)

  useEffect(() => {
    fetch('/api/browse-categories')
      .then(r => r.json())
      .then(json => {
        console.log('[browse] API response:', JSON.stringify(json).slice(0, 300))
        if (json?.categories?.length) setCategories(json.categories)
        else console.error('[browse] no categories in response:', json)
      })
      .catch(e => console.error('[browse] fetch error:', e))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selected) { setEvents([]); return }
    setEventsLoading(true)
    fetch(`/api/browse-events?category=${encodeURIComponent(selected)}`)
      .then(r => r.json())
      .then(json => { if (json?.events) setEvents(json.events) })
      .catch(e => console.error('[browse] events error:', e))
      .finally(() => setEventsLoading(false))
  }, [selected])

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-navy mb-2">What are you planning?</h1>
        <p className="text-gray-400 text-sm">Choose a category</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-400 py-16">
          We couldn't load categories right now.{' '}
          <a href="/custom" className="text-navy underline">Describe your event instead</a>.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelected(selected === cat.name ? null : cat.name)}
              className={`rounded-2xl p-5 text-center transition-all border-2 ${
                selected === cat.name
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-100 bg-white hover:border-navy/30 hover:shadow-sm'
              }`}
            >
              <div className="text-3xl mb-2">{ICONS[cat.name] || '📋'}</div>
              <div className="font-semibold text-sm leading-tight mb-1">{cat.name}</div>
              <div className={`text-xs ${selected === cat.name ? 'text-white/60' : 'text-gray-400'}`}>
                {cat.event_count} events
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-10">
          {eventsLoading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse" />
              ))}
            </div>
          ) : events.length > 0 ? (
            <>
              <h2 className="text-xl font-bold text-navy mb-5">{selected}</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-navy transition-colors">
                      {ev.name}
                    </h3>
                  </a>
                ))}
              </div>
              <p className="mt-8 text-center text-sm text-gray-400">
                Don't see your event?{' '}
                <a href="/custom" className="text-navy font-medium hover:underline">
                  Build a custom blueprint →
                </a>
              </p>
            </>
          ) : (
            <p className="text-center text-gray-400 py-8">
              We don't have that one yet —{' '}
              <a href="/custom" className="text-navy underline">describe it instead</a>.
            </p>
          )}
        </div>
      )}
    </main>
  )
}
