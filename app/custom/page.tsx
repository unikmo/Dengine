'use client'

import { useState, useEffect } from 'react'
import { Zap, Clock, Users, Search, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { GeneratedTask, Event, SmartContext } from '@/types'
import { LAYER_COLORS } from '@/types'
import { calculateSuggestedStart, formatDate } from '@/lib/anthropic'
import dynamic from 'next/dynamic'

const GanttView = dynamic(() => import('@/components/GanttView'), { ssr: false })

const layers = ['Promotion', 'Setup', 'Execution', 'Cleanup'] as const

const BUDGET_OPTIONS = [
  { level: 0, icon: '🙌', label: 'Volunteer', desc: 'Community-run. Everyone contributes one small task.' },
  { level: 1, icon: '🌱', label: 'Budget', desc: 'Minimal spend. DIY where possible.' },
  { level: 2, icon: '⚖️', label: 'Balanced', desc: 'Good quality at reasonable cost.' },
  { level: 3, icon: '🏅', label: 'Premium', desc: 'Elevated experience, professional vendors.' },
  { level: 4, icon: '💎', label: 'Luxury', desc: 'High-end, full professional team.' },
  { level: 5, icon: '👑', label: 'Extravagant', desc: 'Money is secondary. Best possible experience.' },
] as const

type ViewMode = 'layer' | 'subproject' | 'gantt'

export default function CustomEventPage() {
  // Step 1 fields
  const [eventName, setEventName] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [context, setContext] = useState('')
  const [venue, setVenue] = useState<'indoor' | 'mixed' | 'outdoor'>('indoor')
  const [budgetLevel, setBudgetLevel] = useState<number>(2)
  const [hoveredBudget, setHoveredBudget] = useState<number | null>(null)

  // Autocomplete
  const [suggestions, setSuggestions] = useState<Event[]>([])
  const [showSug, setShowSug] = useState(false)
  const [foundInDB, setFoundInDB] = useState(false)
  const [matchedEvent, setMatchedEvent] = useState<Event | null>(null)

  // Step tracking
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Step 2 fields (smart context)
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [spendType, setSpendType] = useState<'unknown' | 'volunteer' | 'amount'>('unknown')
  const [spendAmount, setSpendAmount] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [planningStart, setPlanningStart] = useState('')
  const [suggestedStart, setSuggestedStart] = useState('')
  const [lateWarning, setLateWarning] = useState(false)

  // Step 3 fields
  const [generating, setGenerating] = useState(false)
  const [tasks, setTasks] = useState<GeneratedTask[]>([])
  const [claimName, setClaimName] = useState('')
  const [claimedBy, setClaimedBy] = useState<Record<number, string>>({})
  const [viewMode, setViewMode] = useState<ViewMode>('layer')

  // ── Autocomplete ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!eventName || eventName.length < 2) {
      setSuggestions([])
      setShowSug(false)
      return
    }
    const t = setTimeout(async () => {
      const { data } = await supabase.rpc('search_events', { query: eventName, cat: null }).limit(6)
      if (data?.length) { setSuggestions(data); setShowSug(true) }
      else { setSuggestions([]); setShowSug(false) }
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

  // ── Event date → suggested planning start ─────────────────────────────────
  useEffect(() => {
    if (!eventDate) { setSuggestedStart(''); setLateWarning(false); return }
    const weeks = matchedEvent?.planning_weeks ?? 4
    const suggested = calculateSuggestedStart(eventDate, weeks)
    setSuggestedStart(suggested)
    if (!planningStart) setPlanningStart(suggested)

    const today = new Date().toISOString().split('T')[0]
    setLateWarning(today > suggested)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDate, matchedEvent])

  useEffect(() => {
    if (!planningStart || !suggestedStart) return
    setLateWarning(planningStart > suggestedStart)
  }, [planningStart, suggestedStart])

  // ── Step 1 → next ─────────────────────────────────────────────────────────
  async function handleStep1Next() {
    if (!eventName.trim()) return
    // Check DB match confidence
    const { data } = await supabase.rpc('search_events', { query: eventName, cat: null }).limit(1)
    if (data?.length) {
      const ev = data[0] as Event
      setMatchedEvent(ev)
      setFoundInDB(true)
      // If we have a pre-built blueprint, skip to generate
      if (ev.has_tasks) {
        await generateFromDB(ev)
        return
      }
    }
    setStep(2)
  }

  async function generateFromDB(ev: Event) {
    setGenerating(true)
    setStep(3)
    setTasks([])
    setClaimedBy({})
    const { data: taskData } = await supabase
      .from('tasks').select('*')
      .eq('event_id', ev.id).order('slot')
    if (taskData?.length) {
      setTasks(taskData.map((t: any) => ({
        layer: t.layer,
        title: t.title,
        time_minutes: t.time_minutes,
        who: t.who,
        definition_of_done: t.definition_of_done,
        is_volunteer_claimable: true,
        sub_project: t.sub_project ?? undefined,
        weeks_before_event: t.weeks_before_event ?? undefined,
        target_date: t.target_date ?? undefined,
      })))
    }
    setGenerating(false)
  }

  // ── Step 2 → generate ─────────────────────────────────────────────────────
  async function handleGenerate() {
    setGenerating(true)
    setStep(3)
    setTasks([])
    setClaimedBy({})

    const guests = parseInt(guestCount) || 50

    const smart: SmartContext = {
      city: city || undefined,
      country: country || undefined,
      spendType,
      spendAmount: spendType === 'amount' && spendAmount ? parseFloat(spendAmount) : undefined,
      eventDate: eventDate || undefined,
      planningStart: planningStart || undefined,
    }

    const fakeEvent = {
      id: 'custom',
      name: eventName,
      category: matchedEvent?.category ?? 'Custom',
      subcategory: matchedEvent?.subcategory ?? 'Custom',
      scale: (guests < 50 ? 'Intimate' : guests < 500 ? 'Medium' : guests < 5000 ? 'Large' : 'Mega') as any,
      blueprint: matchedEvent?.blueprint ?? 'General',
      luxury_base: budgetLevel,
      complexity: 3,
      planning_weeks: matchedEvent?.planning_weeks ?? 4,
      description: `${eventName} for approximately ${guests} guests.${context ? ' ' + context : ''}`,
      key_dimensions: matchedEvent?.key_dimensions ?? ['logistics', 'coordination'],
      primary_cost: matchedEvent?.primary_cost ?? 'Venue and logistics',
      key_risks: matchedEvent?.key_risks ?? [],
      intake_questions: matchedEvent?.intake_questions ?? [],
      has_tasks: false,
    }

    const intake = {
      guest_count: guests,
      budget_level: budgetLevel,
      is_first_time: false,
      is_volunteer_driven: budgetLevel <= 1,
      is_outdoor: venue === 'outdoor',
      custom_answers: { description: context },
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: fakeEvent, intake, smart }),
      })
      const data = await res.json()
      if (data.tasks) {
        setTasks(data.tasks)
        // Auto-switch to Gantt if event date provided and tasks have target_dates
        if (eventDate && data.tasks.some((t: GeneratedTask) => t.target_date)) {
          setViewMode('gantt')
        }
      }
    } catch (e) {
      console.error(e)
    }
    setGenerating(false)
  }

  function claimTask(idx: number) {
    setClaimedBy(p => ({ ...p, [idx]: claimName.trim() || 'Anonymous' }))
  }

  // ── Derived data ──────────────────────────────────────────────────────────
  const tasksByLayer = layers.reduce((acc, l) => {
    acc[l] = tasks.filter(t => t.layer === l)
    return acc
  }, {} as Record<string, GeneratedTask[]>)

  const subprojects = Array.from(new Set(tasks.map(t => t.sub_project).filter(Boolean))) as string[]
  const tasksBySubproject = subprojects.reduce((acc, sp) => {
    acc[sp] = tasks
      .filter(t => t.sub_project === sp)
      .sort((a, b) => (b.weeks_before_event ?? 0) - (a.weeks_before_event ?? 0))
    return acc
  }, {} as Record<string, GeneratedTask[]>)
  // Tasks without sub_project fall into their layer group
  const unsortedTasks = tasks.filter(t => !t.sub_project)

  const totalMinutes = tasks.reduce((s, t) => s + t.time_minutes, 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  const hasGantt = !!(eventDate && planningStart && tasks.some(t => t.target_date))
  const activeBudget = hoveredBudget !== null ? hoveredBudget : budgetLevel

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-navy mb-6">Break down any event into actionable tasks</h1>

      {/* ── STEP 1: Form ── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          {/* Event name */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              What event are you planning?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={eventName}
                onChange={e => { setEventName(e.target.value); setFoundInDB(false); setMatchedEvent(null) }}
                placeholder="e.g. Charity Gala, School Fair, Team Building Day..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-base"
              />
            </div>

            {showSug && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                <div className="px-4 py-2 bg-green-50 border-b border-green-100 text-xs font-semibold text-green-700">
                  Found in Dengine knowledge base
                </div>
                {suggestions.map(ev => (
                  <button key={ev.id} onClick={() => pickSuggestion(ev)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 text-left border-b border-gray-50 last:border-0">
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
              <p className="mt-2 text-sm text-green-600 font-medium">
                Matched {matchedEvent.name} — {matchedEvent.has_tasks ? 'full blueprint ready' : 'profile found'}
              </p>
            )}
          </div>

          {/* Context */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Any context? (optional)</label>
            <input
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. formal dinner, multicultural guests, beachside venue..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-base"
            />
          </div>

          {/* Guests + Venue */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Number of guests</label>
              <input
                type="number" min="1" value={guestCount}
                onChange={e => setGuestCount(e.target.value)}
                placeholder="e.g. 200"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden h-[50px]">
                {(['indoor', 'mixed', 'outdoor'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setVenue(v)}
                    className={`flex-1 text-sm font-semibold capitalize transition-all ${venue === v ? 'bg-navy text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Budget approach</label>
            <div className="grid grid-cols-6 gap-2">
              {BUDGET_OPTIONS.map(opt => (
                <button
                  key={opt.level}
                  onClick={() => setBudgetLevel(opt.level)}
                  onMouseEnter={() => setHoveredBudget(opt.level)}
                  onMouseLeave={() => setHoveredBudget(null)}
                  className={`p-3 rounded-xl text-center transition-all border-2 ${
                    budgetLevel === opt.level
                      ? 'border-navy bg-navy text-white'
                      : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-navy/30'
                  }`}
                >
                  <div className="text-2xl mb-1">{opt.icon}</div>
                  <div className="text-xs font-semibold leading-tight">{opt.label}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 min-h-[16px]">
              {BUDGET_OPTIONS[activeBudget as 0 | 1 | 2 | 3 | 4 | 5]?.desc}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={handleStep1Next}
            disabled={!eventName.trim()}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
              eventName.trim()
                ? 'bg-gold text-navy hover:bg-yellow-300 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Zap size={18} />
            {foundInDB && matchedEvent?.has_tasks ? 'Load blueprint' : 'Continue'}
          </button>
        </div>
      )}

      {/* ── STEP 2: Smart questions ── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-navy">A few more details</h2>
            <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-navy">← Back</button>
          </div>
          <p className="text-sm text-gray-500 -mt-2">These help Dengine tailor the blueprint for your exact situation.</p>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Where is the event? (optional)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
              />
              <input
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="Country"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
              />
            </div>
          </div>

          {/* Spend per guest */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Spend per guest</label>
            <div className="flex gap-2 mb-3">
              {(['unknown', 'volunteer', 'amount'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setSpendType(t)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    spendType === t
                      ? 'border-navy bg-navy text-white'
                      : 'border-gray-200 text-gray-600 hover:border-navy/30'
                  }`}
                >
                  {t === 'unknown' ? "Don't know" : t === 'volunteer' ? 'Volunteer / $0' : 'Enter amount'}
                </button>
              ))}
            </div>
            {spendType === 'amount' && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  value={spendAmount}
                  onChange={e => setSpendAmount(e.target.value)}
                  placeholder="e.g. 75"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
                />
              </div>
            )}
          </div>

          {/* Event date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event date <span className="font-normal text-gray-400">(optional — enables Gantt view)</span>
            </label>
            <input
              type="date"
              value={eventDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setEventDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy text-sm"
            />
            {eventDate && suggestedStart && (
              <p className="text-xs text-gray-400 mt-1.5">
                Suggested planning start: <strong className="text-navy">{formatDate(suggestedStart)}</strong>
              </p>
            )}
          </div>

          {/* Planning start */}
          {eventDate && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                When do you start planning?
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPlanningStart(suggestedStart)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    planningStart === suggestedStart
                      ? 'border-navy bg-navy text-white'
                      : 'border-gray-200 text-gray-600 hover:border-navy/30'
                  }`}
                >
                  Suggested ({suggestedStart ? new Date(suggestedStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'})
                </button>
                <input
                  type="date"
                  value={planningStart}
                  onChange={e => setPlanningStart(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-navy text-sm"
                />
              </div>
              {lateWarning && (
                <p className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                  ⚠ Starting later than recommended — some tasks may be compressed. Dengine will prioritise urgent items.
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleGenerate}
            className="w-full py-4 rounded-xl font-bold text-base bg-gold text-navy hover:bg-yellow-300 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Zap size={18} /> Build blueprint
          </button>
        </div>
      )}

      {/* ── STEP 3: Blueprint ── */}
      {step === 3 && (
        <div className="mt-2">

          {generating && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <span className="text-4xl animate-spin inline-block mb-4">⚡</span>
              <p className="text-navy font-semibold">Dengine is building your blueprint...</p>
            </div>
          )}

          {!generating && tasks.length > 0 && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-2xl font-bold text-navy">{matchedEvent?.name || eventName}</h2>
                    {foundInDB && (
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        From knowledge base
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm flex flex-wrap gap-3">
                    <span>{tasks.length} tasks</span>
                    <span>{totalHours}h total</span>
                    {city && <span>{city}{country ? `, ${country}` : ''}</span>}
                    {eventDate && (
                      <span>
                        {new Date(eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setStep(1); setTasks([]); setMatchedEvent(null); setFoundInDB(false); setEventName(''); }}
                    className="border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-semibold hover:border-navy/30"
                  >
                    Start over
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    Print
                  </button>
                </div>
              </div>

              {/* View toggle */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
                {(['layer', 'subproject'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setViewMode(m)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      viewMode === m ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'
                    }`}
                  >
                    {m === 'layer' ? 'By layer' : 'By sub-project'}
                  </button>
                ))}
                {hasGantt && (
                  <button
                    onClick={() => setViewMode('gantt')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      viewMode === 'gantt' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'
                    }`}
                  >
                    Gantt
                  </button>
                )}
              </div>

              {/* Gantt view */}
              {viewMode === 'gantt' && hasGantt && (
                <GanttView
                  tasks={tasks}
                  eventDate={eventDate}
                  planningStart={planningStart}
                  eventName={matchedEvent?.name || eventName}
                />
              )}

              {/* Layer / Sub-project view */}
              {viewMode !== 'gantt' && (
                <>
                  {/* Volunteer claim bar */}
                  <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4 mb-5">
                    <Users size={18} className="text-navy flex-shrink-0" />
                    <input
                      type="text" value={claimName} onChange={e => setClaimName(e.target.value)}
                      placeholder="Enter your name — then tap any task to claim it"
                      className="flex-1 focus:outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Task list */}
                  <div className="space-y-6">
                    {viewMode === 'layer' && layers.map(layer => {
                      const lt = tasksByLayer[layer] || []
                      if (!lt.length) return null
                      const colors = LAYER_COLORS[layer]
                      return (
                        <div key={layer}>
                          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg mb-3 text-sm font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                            {layer} <span className="font-normal opacity-60">({lt.length})</span>
                          </div>
                          <TaskList tasks={lt} tasksAll={tasks} colors={colors} claimedBy={claimedBy} claimTask={claimTask} />
                        </div>
                      )
                    })}

                    {viewMode === 'subproject' && (
                      <>
                        {subprojects.map(sp => {
                          const spTasks = tasksBySubproject[sp] || []
                          return (
                            <div key={sp}>
                              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg mb-3 text-sm font-bold bg-navy/5 text-navy border border-navy/10">
                                {sp} <span className="font-normal opacity-60">({spTasks.length})</span>
                              </div>
                              <TaskList tasks={spTasks} tasksAll={tasks} colors={null} claimedBy={claimedBy} claimTask={claimTask} />
                            </div>
                          )
                        })}
                        {unsortedTasks.length > 0 && (
                          <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg mb-3 text-sm font-bold bg-gray-50 text-gray-600 border border-gray-200">
                              Other <span className="font-normal opacity-60">({unsortedTasks.length})</span>
                            </div>
                            <TaskList tasks={unsortedTasks} tasksAll={tasks} colors={null} claimedBy={claimedBy} claimTask={claimTask} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </main>
  )
}

// ── TaskList sub-component ────────────────────────────────────────────────────
function TaskList({
  tasks,
  tasksAll,
  colors,
  claimedBy,
  claimTask,
}: {
  tasks: GeneratedTask[]
  tasksAll: GeneratedTask[]
  colors: { bg: string; text: string; border: string; dot: string } | null
  claimedBy: Record<number, string>
  claimTask: (idx: number) => void
}) {
  return (
    <div className="space-y-2">
      {tasks.map((task, i) => {
        const idx = tasksAll.indexOf(task)
        const claimed = claimedBy[idx]
        const layerColors = colors ?? LAYER_COLORS[task.layer]
        return (
          <div
            key={i}
            onClick={() => !claimed && claimTask(idx)}
            className={`bg-white rounded-xl border p-4 transition-all cursor-pointer ${
              claimed ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-navy/20 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                <p className="text-xs text-gray-500 mt-1">{task.who}</p>
                <p className="text-xs text-gray-400 mt-1 italic">{task.definition_of_done}</p>
                {task.target_date && (
                  <p className="text-xs text-blue-500 mt-1">
                    Target: {new Date(task.target_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${layerColors.bg} ${layerColors.text}`}>
                  <Clock size={10} />{task.time_minutes} min
                </span>
                {claimed
                  ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ {claimed}</span>
                  : <span className="text-xs text-gray-400">tap to claim</span>
                }
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
