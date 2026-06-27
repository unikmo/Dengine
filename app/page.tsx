'use client'
import { useState, useEffect } from 'react'
import { Zap, Clock, Users, Search, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { GeneratedTask, BudgetLevel, Event } from '@/types'
import { LAYER_COLORS } from '@/types'

const layers = ['Promotion', 'Setup', 'Execution', 'Cleanup'] as const
const BUDGET_OPTIONS = [
  { level: 0, icon: '🌱', label: 'Cost-Efficient', desc: 'Volunteer-run, minimal spend' },
  { level: 1, icon: '⚖️', label: 'Balanced', desc: 'Good quality, reasonable cost' },
  { level: 2, icon: '🏅', label: 'Premium', desc: 'Elevated, quality-focused' },
  { level: 3, icon: '💎', label: 'Luxury', desc: 'High-end, brand experience' },
  { level: 4, icon: '👑', label: 'Extravagant', desc: 'Money is secondary' },
]

export default function CustomEventPage() {
  const [eventName, setEventName] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>(0)
  const [isVolunteer, setIsVolunteer] = useState(true)
  const [isOutdoor, setIsOutdoor] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [tasks, setTasks] = useState<GeneratedTask[]>([])
  const [claimName, setClaimName] = useState('')
  const [claimedBy, setClaimedBy] = useState<Record<number, string>>({})
  const [suggestions, setSuggestions] = useState<Event[]>([])
  const [showSug, setShowSug] = useState(false)
  const [foundInDB, setFoundInDB] = useState(false)
  const [matchedEvent, setMatchedEvent] = useState<Event | null>(null)

  useEffect(() => {
    if (!eventName || eventName.length < 2) { setSuggestions([]); setShowSug(false); return }
    const t = setTimeout(async () => {
      const { data } = await supabase.rpc('search_events', { query: eventName, cat: null }).limit(6)
      if (data?.length) { setSuggestions(data); setShowSug(true) } else { setSuggestions([]); setShowSug(false) }
    }, 300)
    return () => clearTimeout(t)
  }, [eventName])

  function pickSuggestion(ev: Event) {
    setEventName(ev.name)
    setMatchedEvent(ev)
    setFoundInDB(true)
    setSuggestions([])
    setShowSug(false)
  }

  async function generate() {
    if (!eventName.trim()) return
    setGenerating(true)
    setTasks([])
    setClaimedBy({})
    const guests = parseInt(guestCount) || 50
    const { data: dbResults } = await supabase.rpc('search_events', { query: eventName, cat: null }).limit(1)
    if (dbResults?.length) {
      const matched = dbResults[0] as Event
      setMatchedEvent(matched)
      setFoundInDB(true)
      if (matched.has_tasks) {
        const { data: taskData } = await supabase.from('tasks').select('*').eq('event_id', matched.id).order('slot')
        if (taskData?.length) {
          setTasks(taskData.map((t: any) => ({
            layer: t.layer, title: t.title, time_minutes: t.time_minutes,
            who: t.who, definition_of_done: t.definition_of_done,
            is_volunteer_claimable: t.time_minutes <= 15
          })))
          setGenerating(false)
          return
        }
      }
    }
    await supabase.from('blueprints').insert({ event_id: null, event_name: eventName, guest_count: guests, budget_level: budgetLevel, is_volunteer_driven: isVolunteer, tasks: [] })
    try {
      const fakeEvent = {
        id: 'custom', name: eventName, category: 'Custom', subcategory: 'Custom',
        scale: guests < 50 ? 'Intimate' : guests < 500 ? 'Medium' : guests < 5000 ? 'Large' : 'Mega',
        blueprint: 'General', luxury_base: budgetLevel, complexity: 3, planning_weeks: 4,
        description: `${eventName} for approximately ${guests} guests.`,
        key_dimensions: ['logistics', 'catering', 'coordination'],
        primary_cost: 'Venue and catering', key_risks: [], intake_questions: [], has_tasks: false
      }
      const intake = { guest_count: guests, budget_level: budgetLevel, is_first_time: isFirstTime, is_volunteer_driven: isVolunteer, is_outdoor: isOutdoor, custom_answers: {} }
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: fakeEvent, intake }) })
      const data = await res.json()
      if (data.tasks) setTasks(data.tasks)
    } catch (e) { console.error(e) }
    setGenerating(false)
  }

  function claimTask(idx: number) {
    setClaimedBy(p => ({ ...p, [idx]: claimName.trim() || 'Anonymous' }))
  }

  const tasksByLayer = layers.reduce((acc, l) => {
    acc[l] = tasks.filter(t => t.layer === l)
    return acc
  }, {} as Record<string, GeneratedTask[]>)

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-navy mb-1">Custom Event Builder</h1>
      <p className="text-gray-500 mb-8">Dengine checks its knowledge base first then builds a tailored plan for anything new.</p>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">What event are you planning?</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={eventName} onChange={e => { setEventName(e.target.value); setFoundInDB(false); setMatchedEvent(null) }}
              placeholder="e.g. Charity Gala, School Fair, Team Building Day..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-base" />
          </div>
          {showSug && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden">
              <div className="px-4 py-2 bg-green-50 border-b border-green-100 text-xs font-semibold text-green-700">Found in Dengine knowledge base</div>
              {suggestions.map(ev => (
                <button key={ev.id} onClick={() => pickSuggestion(ev)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{ev.name}</div>
                    <div className="text-xs text-gray-400">{ev.category} · {ev.has_tasks ? 'Full blueprint ready' : 'Profile available'}</div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
          {foundInDB && matchedEvent && (
            <p className="mt-2 text-sm text-green-600 font-medium">Matched {matchedEvent.name} — {matchedEvent.has_tasks ? 'full blueprint ready' : 'profile found'}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Expected number of guests</label>
          <input type="number" min="1" value={guestCount} onChange={e => setGuestCount(e.target.value)}
            placeholder="e.g. 200"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-base" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Budget approach</label>
          <div className="grid grid-cols-5 gap-2">
            {BUDGET_OPTIONS.map(opt => (
              <button key={opt.level} onClick={() => setBudgetLevel(opt.level as BudgetLevel)}
                className={`p-3 rounded-xl text-center transition-all border-2 ${budgetLevel === opt.level ? 'border-navy bg-navy text-white' : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-200'}`}>
                <div className="text-2xl mb-1">{opt.icon}</div>
                <div className="text-xs font-semibold leading-tight">{opt.label}</div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">{BUDGET_OPTIONS[budgetLevel].desc}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {([['Volunteer-driven (15-min tasks)', isVolunteer, setIsVolunteer, '🙌'], ['First time running this event', isFirstTime, setIsFirstTime, '🆕'], ['Outdoor event', isOutdoor, setIsOutdoor, '🌤️']] as const).map(([label, value, setter, icon]: any) => (
            <label key={label} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm font-medium ${value ? 'border-navy bg-navy/5 text-navy' : 'border-gray-100 bg-gray-50 text-gray-600'}`}>
              <input type="checkbox" checked={value} onChange={e => setter(e.target.checked)} className="sr-only" />
              <span>{icon}</span><span>{label}</span>
            </label>
          ))}
        </div>
        <button onClick={generate} disabled={!eventName.trim() || generating}
          className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${eventName.trim() && !generating ? 'bg-gold text-navy hover:bg-yellow-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
          {generating ? <><span className="animate-spin inline-block">⚡</span> Loading...</> : foundInDB && matchedEvent?.has_tasks ? <><Zap size={18} />Load blueprint</> : <><Zap size={18} />Get Dengine blueprint</>}
        </button>
      </div>
      {tasks.length > 0 && (
        <div className="mt-8">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-navy">{matchedEvent?.name || eventName}</h2>
                {foundInDB && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">From knowledge base</span>}
              </div>
              <p className="text-gray-500">{tasks.length} tasks · {Math.round(tasks.reduce((s, t) => s + t.time_minutes, 0) / 60 * 10) / 10}h total{isVolunteer && ' · All 15 min or less'}</p>
            </div>
            <button onClick={() => window.print()} className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold">Print</button>
          </div>
          {isVolunteer && (
            <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 mb-5">
              <Users size={18} className="text-navy flex-shrink-0" />
              <input type="text" value={claimName} onChange={e => setClaimName(e.target.value)}
                placeholder="Enter your name then tap any task to claim it"
                className="flex-1 focus:outline-none text-sm text-gray-700" />
            </div>
          )}
          <div className="space-y-6">
            {layers.map(layer => {
              const lt = tasksByLayer[layer] || []
              if (!lt.length) return null
              const colors = LAYER_COLORS[layer]
              return (
                <div key={layer}>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg mb-3 text-sm font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {layer} <span className="font-normal opacity-60">({lt.length})</span>
                  </div>
                  <div className="space-y-2">
                    {lt.map((task, i) => {
                      const idx = tasks.indexOf(task)
                      const claimed = claimedBy[idx]
                      return (
                        <div key={i} onClick={() => isVolunteer && !claimed && claimTask(idx)}
                          className={`bg-white rounded-xl border p-4 transition-all ${isVolunteer && !claimed ? 'cursor-pointer hover:border-navy/20' : ''} ${claimed ? 'border-green-200 bg-green-50' : 'border-gray-100'}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{task.who}</p>
                              <p className="text-xs text-gray-400 mt-1 italic">{task.definition_of_done}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                <Clock size={10} />{task.time_minutes} min
                              </span>
                              {claimed ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Done {claimed}</span> : isVolunteer && <span className="text-xs text-gray-400">tap to claim</span>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}