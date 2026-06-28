'use client'
import { useEffect, useState } from 'react'
import { Search, ChevronRight, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
const ICONS: Record<string,string> = {'Social & Life':'🎉','Corporate & Business':'💼','Education & Youth':'📚','Arts & Entertainment':'🎭','Sports & Fitness':'🏆','Civic & Community':'🤝','Religious & Spiritual':'✨','Niche & Subculture':'🎲','Cultural & Diaspora':'🌍','Government & Political':'🏛️','Health & Medical':'❤️','Fundraising':'💛','Volunteer-Driven':'🙌','Hospitality & Food':'🍽️','Agriculture & Rural':'🌾','Military & Veterans':'🎖️','Media & Creative':'🎬','Trade & Professional':'🤝','Social Causes':'🌱','Heritage & History':'🏺','Water Events':'🌊','Adventure & Extreme':'⛰️','Motorsport & Automotive':'🏎️','Animal Events':'🐾','Equestrian':'🐴','Seasonal':'🌸','Digital & Hybrid':'💻'}
export default function BrowsePage() {
  const [categories, setCategories] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  useEffect(() => {
    supabase
      .from('events')
      .select('category')
      .then(({ data, error }) => {
        console.log('categories data:', data, 'error:', error)
        if (data) {
          const counts: Record<string, number> = {}
          data.forEach((r: any) => {
            counts[r.category] = (counts[r.category] || 0) + 1
          })
          const cats = Object.entries(counts)
            .map(([name, event_count]) => ({ name, event_count }))
            .sort((a, b) => a.name.localeCompare(b.name))
          setCategories(cats)
        }
      })
  }, [])
  useEffect(() => {
    if (!query || query.length < 2) { setResults([]); setShowResults(false); return }
    setSearching(true)
    const t = setTimeout(async () => {
      const { data } = await supabase.rpc('search_events', { query, cat: null }).limit(8)
      setResults(data || []); setShowResults(true); setSearching(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query])
  return (
    <main>
      <div className="bg-navy text-white py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">Browse Events</h1>
          <p className="text-white/60 mb-8">266 event types across 27 categories</p>
          <div className="text-left mt-10">
            <p className="text-white/40 text-sm mb-3">Browse by category below ↓</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {categories.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">{[...Array(15)].map((_, i) => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />)}</div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categories.map(cat => (
                <a
                  key={cat.name}
                  href={`/browse/${encodeURIComponent(cat.name)}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-navy/20 p-5 text-center group transition-all"
                >
                  <div className="text-3xl mb-2">{ICONS[cat.name] || '📋'}</div>
                  <div className="font-semibold text-gray-900 text-sm group-hover:text-navy leading-tight mb-1">{cat.name}</div>
                  <div className="text-xs text-gray-400">{cat.event_count} events</div>
                </a>
              ))}
            </div>


          </>
        )}
      </div>
    </main>
  )
}
