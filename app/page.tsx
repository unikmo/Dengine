'use client'
import { useState, useEffect } from 'react'
import { Search, Zap, Users, Clock, ChevronRight, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Event } from '@/types'

const CATEGORY_ICONS: Record<string, string> = {
  'Social & Life': '🎉', 'Corporate & Business': '💼', 'Education & Youth': '📚',
  'Arts & Entertainment': '🎭', 'Sports & Fitness': '🏆', 'Civic & Community': '🤝',
  'Religious & Spiritual': '✨', 'Niche & Subculture': '🎲', 'Cultural & Diaspora': '🌍',
  'Government & Political': '🏛️', 'Health & Medical': '❤️', 'Fundraising': '💛',
  'Volunteer-Driven': '🙌', 'Hospitality & Food': '🍽️', 'Agriculture & Rural': '🌾',
  'Military & Veterans': '🎖️', 'Media & Creative': '🎬', 'Trade & Professional': '🤝',
  'Social Causes': '🌱', 'Heritage & History': '🏛️', 'Water Events': '🌊',
  'Adventure & Extreme': '⛰️', 'Motorsport & Automotive': '🏎️', 'Animal Events': '🐾',
  'Equestrian': '🐴', 'Seasonal': '🌸', 'Digital & Hybrid': '💻',
}

export default function HomePage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Event[]>([])
  const [categories, setCategories] = useState<{ name: string; event_count: number }[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setSearching(true)
      const { data } = await supabase.rpc('search_events', { query, cat: null }).limit(8)
      setResults(data || [])
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <main>
      {/* Hero */}
      <div className="bg-navy text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap size={14} /> 354+ event blueprints · 1,385 pre-built tasks
          </div>
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Plan any event in minutes.<br />
            <span className="text-gold">Not hours.</span>
          </h1>
          <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto">
            Select your event, answer 5 smart questions, get an instant task blueprint. 
            Every task is 15 minutes or less — so anyone can help.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What are you planning? (wedding, concert, bake sale...)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                Searching...
              </div>
            )}

            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-10">
                {results.map(event => (
                  <a key={event.id} href={`/events/${event.id}`}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div>
                      <div className="font-semibold text-gray-900">{event.name}</div>
                      <div className="text-sm text-gray-500">{event.category} · {event.scale}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.has_tasks && (
                        <span className="badge bg-green-100 text-green-700">Ready</span>
                      )}
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-center gap-6 text-white/50 text-sm">
            <span>Try: "fall festival"</span>
            <span>·</span>
            <span>"charity gala"</span>
            <span>·</span>
            <span>"team building"</span>
            <span>·</span>
            <span>"wedding"</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-gold/20 border-b border-gold/30 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-12 text-sm font-medium text-navy">
          <div className="flex items-center gap-2"><Star size={16} className="text-gold fill-gold" /><span>354 event types</span></div>
          <div className="flex items-center gap-2"><Clock size={16} /><span>1,385 pre-built tasks</span></div>
          <div className="flex items-center gap-2"><Users size={16} /><span>Volunteer-first design</span></div>
          <div className="flex items-center gap-2"><Zap size={16} /><span>Dengine custom blueprints</span></div>
        </div>
      </div>

      {/* Category grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-navy mb-3">Browse by category</h2>
          <p className="text-gray-600">27 categories covering every type of human gathering</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map(cat => (
            <a key={cat.name} href={`/browse/${encodeURIComponent(cat.name)}`}
              className="card p-4 text-center hover:border-navy/20 cursor-pointer group">
              <div className="text-3xl mb-2">{CATEGORY_ICONS[cat.name] || '📋'}</div>
              <div className="font-semibold text-gray-900 text-sm group-hover:text-navy transition-colors leading-tight">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-1">{cat.event_count} events</div>
            </a>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-navy text-white py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', icon: '🔍', title: 'Find your event', desc: 'Search 354+ events or describe your own' },
              { step: '2', icon: '❓', title: 'Answer 5 questions', desc: 'Guest count, budget level, first time, volunteer or professional' },
              { step: '3', icon: '⚡', title: 'Get instant blueprint', desc: 'All tasks generated — 15 min each, organized by layer' },
              { step: '4', icon: '✅', title: 'Share and claim', desc: 'Volunteers tap to claim tasks. No one carries everything.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="text-gold font-bold text-sm mb-1">STEP {s.step}</div>
                <div className="font-semibold text-lg mb-2">{s.title}</div>
                <div className="text-white/60 text-sm">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom event CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-navy mb-4">Can't find your event?</h2>
        <p className="text-gray-600 mb-8 text-lg">Describe any event — Dengine builds the task blueprint from its knowledge base.</p>
        <a href="/custom" className="btn-primary text-lg px-8 py-4">
          <Zap size={20} /> Build a custom blueprint
        </a>
      </div>
    </main>
  )
}
