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
        const cats = Object.entries(counts)
          .map(([name, event_count]) => ({ name, event_count }))
          .sort((a, b) => a.name.localeCompare(b.name))
        setCategories(cats)
        setLoading(false)
      })
  }, [])

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-navy mb-3">What are you planning?</h1>
        <p className="text-gray-400">Choose a category to see all event blueprints</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <a
              key={cat.name}
              href={`/browse/${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className="text-3xl mb-3">{ICONS[cat.name] || '📋'}</div>
              <div className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-navy transition-colors">
                {cat.name}
              </div>
              <div className="text-xs text-gray-400">{cat.event_count} events</div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-400 mb-3">Don't see your event type?</p>
        <a href="/custom" className="bg-navy text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-navy/90 transition-colors inline-block">
          Describe it and we'll build the blueprint →
        </a>
      </div>
    </main>
  )
}
