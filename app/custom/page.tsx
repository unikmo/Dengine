'use client'
import { useState, useEffect, useRef } from 'react'
import { Zap, Clock, Users, Search, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { GeneratedTask, BudgetLevel, Event } from '@/types'
import { BUDGET_LABELS, BUDGET_DESCRIPTIONS, LAYER_COLORS } from '@/types'

const layers = ['Promotion', 'Setup', 'Execution', 'Cleanup'] as const
const BUDGET_ICONS = ['🌱', '⚖️', '🏅', '💎', '👑']

export default function CustomEventPage() {
  const [eventName, setEventName] = useState('')
  const [description, setDescription] = useState('')
  const [guestCount, setGuestCount] = useState(50)
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>(0)
  const [isVolunteer, setIsVolunteer] = useState(true)
  const [isOutdoor, setIsOutdoor] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [tasks, setTasks] = useState<GeneratedTask[]>([])
  const [claimName, setClaimName] = useState('')
  const [claimedBy, setClaimedBy] = useState<Record<number, string>>({})
  const [suggestions, setSuggestions] = useState<Event[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [foundInDB, setFoundInDB] = useState(false)
  const [matchedEvent, setMatchedEvent] = useState<Event | null>(null)

  useEffect(() => {
    if (!eventName || eventName.length < 2) { setSuggestions([]); setShowSuggestions(false); return }
    const timer = setTimeout(async () => {
      const { data } = await supabase.rpc('search_events', { query: eventName, cat: null }).limit(5)
      if (data && data.length > 0) { setSuggestions(data); setShowSuggestions(true) }
    }, 300)
    return () => clearTimeout(timer)
  }, [eventName])

  function selectSuggestion(ev: Event) {
    setEventName(ev.name); setMatchedEvent(ev); setFoundInDB(true)
    setSuggestions([]); setShowSuggestions(false)
  }

  async function generate() {
    if (!eventName.trim()) return
    setGenerating(true); setTasks([])

    const { data: dbResults } = await supabase.rpc('search_events', { query: eventName, cat: null }).limit(1)

    if (dbResults && dbResults.length > 0) {
      const matched = dbResults[0] as Event
      setMatchedEvent(matched); setFoundInDB(true)
      if (matched.has_tasks) {
        const { data: taskData } = await supabase.from('tasks').select('*').eq('event_id', matched.id).order('slot')
        if (taskData && taskData.length > 0) {
          setTasks(taskData.map((t: any) => ({ layer: t.layer, title: t.title, time_minutes: t.time_minutes, who: t.who, definition_of_done: t.definition_of_done, is_volunteer_claimable: t.time_minutes <= 15 })))
          setGenerating(false); return
        }
      }
    }

    // Log unknown event for learning
    await supabase.from('blueprints').insert({ event_id: null, event_name: eventName, guest_count: guestCount, budget_level: budgetLevel, is_volunteer_driven: isVolunteer, tasks: [] })

    try {
      const fakeEvent = { id: 'custom', name: eventName, category: 'Custom Event', subcategory: 'Custom', scale: guestCount < 50 ? 'Intimate' : guestCount < 500 ? 'Medium' : guestCount < 5000 ? 'Large' : 'Mega', blueprint: 'General', luxury_base: budgetLevel, complexity: 3, planning_weeks: 4, description: description || `A ${eventName} for approximately ${guestCount} guests.`, key_dimensions: ['logistics', 'catering', 'coordination'], primary_cost: 'Venue and catering', key_risks: ['Low turnout', 'Vendor issues'], intake_questions: [], has_tasks: false }
      const intake = { guest_count: guestCount, budget_level: budgetLevel, is_first_time: isFirstTime, is_volunteer_driven: isVolunteer, is_outdoor: isOutdoor, custom_answers: { description } }
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: fakeEvent, intake }) })
      const data = await res.json()
      if (data.tasks) setTasks(data.tasks)
    } catch (e) { console.error(e) }
    setGenerating(false)
  }

  function claimTask(idx: number) {
    setClaimedBy(prev => ({ ...prev, [idx]: claimName.trim() || 'Anonymous' }))
  }

  const tasksByLayer = layers.reduce((acc, layer) => { acc[layer] = tasks.filter(t => t.layer === layer); return acc }, {} as Record<string, GeneratedTask[]>)

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy mb-2">Custom Event Builder</h1>
        <p className="text-gray-600">Dengine checks its knowledge base of 266+ events first — then builds a tailored blueprint for anything it hasn't seen before.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="card p-6 space-y-5">
            <div className="relative">
              <label className="label">Event name <span className="text-red-500">*</span></label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                <input value={eventName} onChange={e => { setEventName(e.target.value); setFoundInDB(false); setMatchedEvent(null) }} placeholder="e.g. Charity Gala, Block Party..." className="input pl-9" />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                  <div className="px-3 py-2 bg-green-50 text-green-700 text-xs font-medium border-b border-green-100">✓ Found in Dengine knowledge base</div>
                  {suggestions.map(ev => (
                    <button key={ev.id} onClick={() => selectSuggestion(ev)} className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
                      <div><div className="text-sm font-medium text-gray-900">{ev.name}</div><div className="text-xs text-gray-400">{ev.category} · {ev.has_tasks ? 'Full blueprint ready' : 'Profile available'}</div></div>
                      <ChevronRight size={14} className="text-gray-300" />
                    </button>
                  ))}
                </div>
              )}
              {foundInDB && matchedEvent && <div className="mt-2 text-xs text-green-600 font-medium">✓ {matchedEvent.name} — {matchedEvent.has_tasks ? 'full blueprint ready' : 'profile found'}</div>}
            </div>
            <div>
              <label className="label">Additional details (optional)</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Anything specific Dengine should know..." rows={3} className="input resize-none" />
            </div>
            <div>
              <label className="label">Expected guests: <span className="font-bold text-navy">{guestCount}</span></label>
              <input type="range" min="5" max="5000" value={guestCount} onChange={e => setGuestCount(+e.target.value)} className="w-full accent-navy" />
            </div>
            <div>
              <label className="label">Budget approach</label>
              <div className="grid grid-cols-5 gap-1">
                {([0,1,2,3,4] as BudgetLevel[]).map(level => (
                  <button key={level} onClick={() => setBudgetLevel(level)} className={`p-2 rounded-lg text-center text-xs font-medium transition-all ${budgetLevel === level ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <div className="text-lg">{BUDGET_ICONS[level]}</div>
                    <div className="leading-tight">{BUDGET_LABELS[level]}</div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">{BUDGET_DESCRIPTIONS[budgetLevel]}</p>
            </div>
            <div className="space-y-3">
              {[['isVolunteer','🙌 Volunteer-driven (15-min tasks)',isVolunteer,setIsVolunteer],['isFirstTime','🆕 First time running this event',isFirstTime,setIsFirstTime],['isOutdoor','🌤️ Outdoor event',isOutdoor,setIsOutdoor]].map(([key,label,value,setter]: any) => (
                <label key={key} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={value} onChange={e => setter(e.target.checked)} className="w-4 h-4 accent-navy" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            <button onClick={generate} disabled={!eventName.trim() || generating} className="btn-gold w-full justify-center py-4 disabled:opacity-50">
              {generating ? <><span className="animate-spin">⚡</span> Loading...</> : foundInDB && matchedEvent?.has_tasks ? <><Zap size={18} /> Load blueprint</> : <><Zap size={18} /> Get Dengine blueprint</>}
            </button>
          </div>
        </div>
        <div className="md:col-span-2">
          {tasks.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <div className="text-5xl mb-4">⚡</div>
              <div className="font-semibold text-lg text-gray-600 mb-2">Your blueprint will appear here</div>
              <div className="text-sm">Dengine searches its knowledge base first,<br/>then builds a tailored plan for anything new</div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-navy">{matchedEvent?.name || eventName}</h2>
                    {foundInDB && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">From knowledge base</span>}
                  </div>
                  <p className="text-sm text-gray-500">{tasks.length} tasks · {Math.round(tasks.reduce((s,t) => s+t.time_minutes,0)/60*10)/10}h total{isVolunteer && ' · All ≤15 min'}</p>
                </div>
                <button onClick={() => window.print()} className="btn-primary text-sm py-2">Print</button>
              </div>
              {isVolunteer && (
                <div className="card p-4 mb-4 flex items-center gap-3">
                  <Users size={16} className="text-navy flex-shrink-0" />
                  <input type="text" value={claimName} onChange={e => setClaimName(e.target.value)} placeholder="Enter your name, then tap any task to claim it" className="input text-sm py-2 flex-1" />
                </div>
              )}
              <div className="space-y-5">
                {layers.map(layer => {
                  const layerTasks = tasksByLayer[layer] || []
                  if (!layerTasks.length) return null
                  const colors = LAYER_COLORS[layer]
                  return (
                    <div key={layer}>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${colors.bg} ${colors.text} border ${colors.border}`}>
                        <span className="font-bold text-sm">{layer}</span>
                        <span className="text-xs opacity-70">({layerTasks.length} tasks)</span>
                      </div>
                      <div className="space-y-2">
                        {layerTasks.map((task, i) => {
                          const globalIdx = tasks.indexOf(task)
                          const claimed = claimedBy[globalIdx]
                          return (
                            <div key={i} onClick={() => isVolunteer && !claimed && claimTask(globalIdx)} className={`card p-4 ${isVolunteer ? 'cursor-pointer' : ''} transition-all ${claimed ? 'border-green-300 bg-green-50' : 'hover:border-navy/20'}`}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 text-sm">{task.title}</div>
                                  <div className="text-xs text-gray-500 mt-1">{task.who}</div>
                                  <div className="text-xs text-gray-400 mt-1 italic">{task.definition_of_done}</div>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  <span className={`badge ${colors.bg} ${colors.text} text-xs`}><Clock size={10} className="mr-1" />{task.time_minutes} min</span>
                                  {claimed ? <span className="badge bg-green-100 text-green-700 text-xs">✓ {claimed}</span> : isVolunteer && <span className="badge bg-gray-100 text-gray-500 text-xs">tap to claim</span>}
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
        </div>
      </div>
    </main>
  )
}
