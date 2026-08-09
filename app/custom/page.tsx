'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardCheck,
  GitBranch,
  RefreshCw,
  Search,
  ShieldAlert,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { calculateSuggestedStart, weeksBeforeToDate } from '@/lib/dates'
import type { BudgetLevel, Event, GeneratedTask, SmartContext } from '@/types'

const GanttView = dynamic(() => import('@/components/GanttView'), { ssr: false })

type Step = 1 | 2 | 3
type PlanView = 'graph' | 'timeline' | 'risks'
type VenueFormat = 'indoor' | 'outdoor' | 'mixed' | 'hybrid'
type VenueStatus = 'confirmed' | 'shortlist' | 'searching' | 'unknown'

const BUDGET_OPTIONS: { value: BudgetLevel; label: string }[] = [
  { value: 0, label: 'Volunteer' },
  { value: 1, label: 'Lean' },
  { value: 2, label: 'Balanced' },
  { value: 3, label: 'Premium' },
  { value: 4, label: 'Luxury' },
  { value: 5, label: 'Best available' },
]

function taskId(task: GeneratedTask, index: number) {
  return task.id || `T${String(index + 1).padStart(2, '0')}`
}

function riskClasses(level?: string) {
  switch (level) {
    case 'critical': return 'bg-red-50 text-red-700 border-red-200'
    case 'high': return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200'
    default: return 'bg-gray-50 text-gray-500 border-gray-200'
  }
}

export default function CustomEventPage() {
  const [step, setStep] = useState<Step>(1)
  const [planView, setPlanView] = useState<PlanView>('graph')

  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [guestCount, setGuestCount] = useState('250')
  const [objective, setObjective] = useState('')
  const [eventFormat, setEventFormat] = useState<VenueFormat>('indoor')
  const [venueStatus, setVenueStatus] = useState<VenueStatus>('unknown')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [teamSize, setTeamSize] = useState('4')
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>(2)
  const [firstTime, setFirstTime] = useState(false)

  const [suggestions, setSuggestions] = useState<Event[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [matchedEvent, setMatchedEvent] = useState<Event | null>(null)

  const [generating, setGenerating] = useState(false)
  const [tasks, setTasks] = useState<GeneratedTask[]>([])
  const [planningStart, setPlanningStart] = useState('')
  const [completed, setCompleted] = useState<Record<string, boolean>>({})
  const [generationError, setGenerationError] = useState('')

  useEffect(() => {
    if (eventName.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timer = setTimeout(async () => {
      const { data } = await supabase.rpc('search_events', { query: eventName, cat: null }).limit(6)
      setSuggestions((data || []) as Event[])
      setShowSuggestions(Boolean(data?.length))
    }, 250)

    return () => clearTimeout(timer)
  }, [eventName])

  const readiness = useMemo(() => {
    if (!tasks.length) return 0
    const totalWeight = tasks.reduce((sum, task) => sum + (task.critical_path ? 3 : 1), 0)
    const completeWeight = tasks.reduce((sum, task, index) => {
      const id = taskId(task, index)
      return sum + (completed[id] ? (task.critical_path ? 3 : 1) : 0)
    }, 0)
    return Math.round((completeWeight / totalWeight) * 100)
  }, [tasks, completed])

  const outstandingCritical = useMemo(
    () => tasks.filter((task, index) => task.critical_path && !completed[taskId(task, index)]),
    [tasks, completed]
  )

  const approvalGates = useMemo(
    () => tasks.filter((task, index) => task.approval_required && !completed[taskId(task, index)]),
    [tasks, completed]
  )

  const highRisks = useMemo(
    () => tasks.filter((task, index) =>
      !completed[taskId(task, index)] && (task.risk_level === 'critical' || task.risk_level === 'high')
    ),
    [tasks, completed]
  )

  const workstreams = useMemo(() => {
    const map = new Map<string, GeneratedTask[]>()
    tasks.forEach(task => {
      const key = task.workstream || task.sub_project || 'Event Operations'
      map.set(key, [...(map.get(key) || []), task])
    })
    return Array.from(map.entries())
  }, [tasks])

  function selectEvent(event: Event) {
    setMatchedEvent(event)
    setEventName(event.name)
    setSuggestions([])
    setShowSuggestions(false)
  }

  function buildEventProfile(): Event {
    const guests = Math.max(1, Number(guestCount) || 250)
    const scale = guests < 50 ? 'Intimate' : guests < 500 ? 'Medium' : guests < 5000 ? 'Large' : 'Mega'

    if (matchedEvent) {
      return {
        ...matchedEvent,
        scale,
        description: `${matchedEvent.description || matchedEvent.name}. ${objective || ''}`.trim(),
      }
    }

    return {
      id: 'custom',
      name: eventName || 'Custom event',
      category: 'Professional Event',
      subcategory: 'Custom',
      scale,
      blueprint: 'Event Execution Graph',
      luxury_base: budgetLevel,
      complexity: 4,
      planning_weeks: 12,
      description: `${eventName || 'Professional event'} for approximately ${guests} attendees. ${objective}`.trim(),
      key_dimensions: [
        'venue and logistics',
        'program',
        'guest experience',
        'production',
        'communications',
        'risk and contingency',
      ],
      primary_cost: 'Venue, production and event operations',
      key_risks: [],
      intake_questions: [],
      has_tasks: false,
    }
  }

  async function generatePlan() {
    if (!eventName.trim() || !eventDate) return

    setGenerating(true)
    setGenerationError('')
    setStep(3)
    setTasks([])
    setCompleted({})

    const event = buildEventProfile()
    const guests = Math.max(1, Number(guestCount) || 250)
    const start = calculateSuggestedStart(eventDate, event.planning_weeks || 12)
    setPlanningStart(start)

    const smart: SmartContext = {
      city: city || undefined,
      country: country || undefined,
      spendType: budgetLevel === 0 ? 'volunteer' : 'unknown',
      eventDate,
      planningStart: start,
    }

    const intake = {
      guest_count: guests,
      budget_level: budgetLevel,
      is_first_time: firstTime,
      is_volunteer_driven: budgetLevel === 0,
      is_outdoor: eventFormat === 'outdoor' || eventFormat === 'mixed',
      custom_answers: {
        objective,
        format: eventFormat,
        venue_status: venueStatus,
        team_size: teamSize,
      },
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, intake, smart }),
      })
      const data = await response.json()

      if (!response.ok || !Array.isArray(data.tasks)) {
        throw new Error(data.error || 'Could not generate the execution plan.')
      }

      setTasks(data.tasks)
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Could not generate the execution plan.')
    } finally {
      setGenerating(false)
    }
  }

  function shiftEventDate(newDate: string) {
    setEventDate(newDate)
    if (!newDate) return

    const weeks = matchedEvent?.planning_weeks || 12
    setPlanningStart(calculateSuggestedStart(newDate, weeks))
    setTasks(current =>
      current.map(task => ({
        ...task,
        target_date:
          task.weeks_before_event != null
            ? weeksBeforeToDate(newDate, task.weeks_before_event)
            : task.target_date,
      }))
    )
  }

  function toggleComplete(task: GeneratedTask, index: number) {
    const id = taskId(task, index)
    setCompleted(current => ({ ...current, [id]: !current[id] }))
  }

  return (
    <main className="bg-[#faf9f6] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10 sm:py-14">
        {step !== 3 && (
          <div className="max-w-3xl mx-auto mb-9">
            <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-3">Build an execution plan</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">
              Give DEngine the fixed date and operating context.
            </h1>
            <p className="text-gray-500 mt-3">It will build the workstreams, dependencies, deadlines, approvals and risks backwards from event day.</p>
          </div>
        )}

        {step === 1 && (
          <section className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-7">
              <span className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <h2 className="font-bold text-navy">The fixed outcome</h2>
                <p className="text-xs text-gray-400">What is happening, when, and at what scale?</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="relative">
                <label className="label">Event type or name</label>
                <Search size={16} className="absolute left-3 top-[43px] text-gray-400" />
                <input
                  value={eventName}
                  onChange={e => {
                    setEventName(e.target.value)
                    setMatchedEvent(null)
                  }}
                  placeholder="Corporate conference, executive retreat, product launch..."
                  className="input pl-10"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                    <p className="px-4 py-2 text-[10px] uppercase tracking-wide text-gray-400 bg-gray-50">Reference models found</p>
                    {suggestions.map(event => (
                      <button
                        key={event.id}
                        onClick={() => selectEvent(event)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-t border-gray-50"
                      >
                        <div>
                          <p className="font-semibold text-sm text-navy">{event.name}</p>
                          <p className="text-xs text-gray-400">{event.category}</p>
                        </div>
                        <ChevronRight size={15} className="text-gray-300" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Fixed event date</label>
                  <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="input" />
                </div>
                <div>
                  <label className="label">Expected attendees</label>
                  <input type="number" min="1" value={guestCount} onChange={e => setGuestCount(e.target.value)} className="input" />
                </div>
              </div>

              <div>
                <label className="label">What must this event achieve?</label>
                <textarea
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  placeholder="e.g. Customer conference to educate 400 enterprise clients, launch the new platform, and generate qualified pipeline."
                  className="input min-h-28 resize-y"
                />
              </div>

              <button
                disabled={!eventName.trim() || !eventDate}
                onClick={() => setStep(2)}
                className="w-full bg-navy text-white py-3.5 rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add operating context →
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-7">
              <span className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <h2 className="font-bold text-navy">Operating context</h2>
                <p className="text-xs text-gray-400">These assumptions activate different event logic.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="label">Format</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['indoor', 'outdoor', 'mixed', 'hybrid'] as VenueFormat[]).map(value => (
                    <button
                      key={value}
                      onClick={() => setEventFormat(value)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold capitalize ${eventFormat === value ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600'}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Venue status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([
                    ['confirmed', 'Confirmed'],
                    ['shortlist', 'Shortlisted'],
                    ['searching', 'Searching'],
                    ['unknown', 'Not decided'],
                  ] as [VenueStatus, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setVenueStatus(value)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold ${venueStatus === value ? 'border-navy bg-navy text-white' : 'border-gray-200 text-gray-600'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label className="label">City</label>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="Berlin" className="input" />
                </div>
                <div>
                  <label className="label">Country</label>
                  <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Germany" className="input" />
                </div>
                <div>
                  <label className="label">Core planning team</label>
                  <input type="number" min="1" value={teamSize} onChange={e => setTeamSize(e.target.value)} className="input" />
                </div>
              </div>

              <div>
                <label className="label">Operating level</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUDGET_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setBudgetLevel(option.value)}
                      className={`rounded-xl border px-3 py-3 text-sm font-semibold ${budgetLevel === option.value ? 'border-gold bg-gold/20 text-navy' : 'border-gray-200 text-gray-600'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex gap-3 items-start rounded-xl bg-gray-50 p-4 cursor-pointer">
                <input type="checkbox" checked={firstTime} onChange={e => setFirstTime(e.target.checked)} className="mt-1" />
                <span>
                  <span className="font-semibold text-sm text-navy block">First time running this event</span>
                  <span className="text-xs text-gray-400">Add extra validation, supplier vetting and preparation work.</span>
                </span>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500">Back</button>
                <button onClick={generatePlan} className="flex-1 bg-gold text-navy py-3.5 rounded-xl font-bold">
                  Build execution graph →
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-7">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-2">Event Execution Graph</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-navy tracking-tight">{eventName}</h1>
                <p className="text-gray-500 mt-2">{guestCount} attendees · {eventFormat} · {matchedEvent?.category || 'Professional event'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500">
                  Update assumptions
                </button>
                <button onClick={generatePlan} className="px-4 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold flex items-center gap-2">
                  <RefreshCw size={14} /> Regenerate
                </button>
              </div>
            </div>

            {generating && (
              <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                <div className="w-10 h-10 rounded-full border-4 border-gray-100 border-t-gold animate-spin mx-auto mb-4" />
                <h2 className="font-bold text-navy">Building the execution graph</h2>
                <p className="text-sm text-gray-400 mt-2">Mapping workstreams, dependencies, approvals, risks and backward deadlines.</p>
              </div>
            )}

            {!generating && generationError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700">
                <p className="font-bold">Plan generation failed</p>
                <p className="text-sm mt-1">{generationError}</p>
                <button onClick={generatePlan} className="mt-4 bg-red-700 text-white rounded-xl px-4 py-2 text-sm font-semibold">Try again</button>
              </div>
            )}

            {!generating && tasks.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-navy text-white rounded-2xl p-5">
                    <p className="text-xs text-white/45 mb-2">Execution readiness</p>
                    <div className="flex items-end justify-between gap-4">
                      <span className="text-4xl font-bold text-gold">{readiness}%</span>
                      <span className="text-xs text-white/35">{Object.values(completed).filter(Boolean).length}/{tasks.length} tasks</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-gold rounded-full transition-all" style={{ width: `${readiness}%` }} />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 mb-2">Critical tasks open</p>
                    <p className="text-3xl font-bold text-navy">{outstandingCritical.length}</p>
                    <p className="text-xs text-gray-400 mt-2">Weighted more heavily in readiness.</p>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 mb-2">Approval gates open</p>
                    <p className="text-3xl font-bold text-navy">{approvalGates.length}</p>
                    <p className="text-xs text-gray-400 mt-2">Explicit decisions blocking downstream work.</p>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <p className="text-xs text-gray-400 mb-2">High / critical risks</p>
                    <p className="text-3xl font-bold text-navy">{highRisks.length}</p>
                    <p className="text-xs text-gray-400 mt-2">With operational consequence + contingency.</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={18} className="text-gold" />
                    <div>
                      <p className="font-semibold text-sm text-navy">Move event day</p>
                      <p className="text-xs text-gray-400">Backward deadlines shift immediately without rebuilding the task graph.</p>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => shiftEventDate(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm"
                  />
                </div>

                <div className="flex gap-2 mb-5 overflow-x-auto">
                  {([
                    ['graph', 'Execution graph', GitBranch],
                    ['timeline', 'Backward timeline', CalendarDays],
                    ['risks', 'Risks + approvals', ShieldAlert],
                  ] as [PlanView, string, any][]).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      onClick={() => setPlanView(value)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap ${planView === value ? 'bg-navy text-white' : 'bg-white border border-gray-100 text-gray-500'}`}
                    >
                      <Icon size={15} /> {label}
                    </button>
                  ))}
                </div>

                {planView === 'graph' && (
                  <div className="space-y-6">
                    {workstreams.map(([workstream, workstreamTasks]) => (
                      <div key={workstream} className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
                        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                          <h2 className="font-bold text-navy">{workstream}</h2>
                          <span className="text-xs text-gray-400">{workstreamTasks.length} tasks</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {workstreamTasks.map(task => {
                            const globalIndex = tasks.indexOf(task)
                            const id = taskId(task, globalIndex)
                            const done = Boolean(completed[id])

                            return (
                              <div key={id} className={`p-5 sm:p-6 ${done ? 'bg-green-50/30' : ''}`}>
                                <div className="flex items-start gap-4">
                                  <button onClick={() => toggleComplete(task, globalIndex)} className="mt-0.5 flex-shrink-0">
                                    {done ? <CheckCircle2 size={22} className="text-green-600" /> : <Circle size={22} className="text-gray-300" />}
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap gap-2 items-center mb-2">
                                      <span className="text-[10px] font-bold tracking-wide text-gray-400">{id}</span>
                                      {task.critical_path && <span className="text-[10px] font-bold rounded-full px-2 py-1 bg-red-50 text-red-700">CRITICAL</span>}
                                      {task.approval_required && <span className="text-[10px] font-bold rounded-full px-2 py-1 bg-purple-50 text-purple-700">APPROVAL</span>}
                                      {task.risk_level && <span className={`text-[10px] font-bold rounded-full border px-2 py-1 uppercase ${riskClasses(task.risk_level)}`}>{task.risk_level}</span>}
                                    </div>

                                    <h3 className={`font-bold text-navy text-base ${done ? 'line-through opacity-55' : ''}`}>{task.title}</h3>
                                    {task.description && <p className="text-sm text-gray-500 mt-1 leading-relaxed">{task.description}</p>}

                                    <div className="grid md:grid-cols-3 gap-3 mt-4 text-xs">
                                      <div className="rounded-xl bg-gray-50 p-3">
                                        <p className="text-gray-400 mb-1">Owner</p>
                                        <p className="font-semibold text-gray-700">{task.who}</p>
                                      </div>
                                      <div className="rounded-xl bg-gray-50 p-3">
                                        <p className="text-gray-400 mb-1">Deadline</p>
                                        <p className="font-semibold text-gray-700">{task.target_date ? new Date(task.target_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not scheduled'}</p>
                                      </div>
                                      <div className="rounded-xl bg-gray-50 p-3">
                                        <p className="text-gray-400 mb-1">Depends on</p>
                                        <p className="font-semibold text-gray-700">{task.depends_on?.length ? task.depends_on.join(', ') : 'No prerequisite'}</p>
                                      </div>
                                    </div>

                                    <details className="mt-4 group">
                                      <summary className="cursor-pointer text-xs font-semibold text-navy list-none flex items-center gap-1">
                                        Operational detail <ChevronRight size={13} className="group-open:rotate-90 transition-transform" />
                                      </summary>
                                      <div className="mt-3 grid md:grid-cols-2 gap-3 text-xs">
                                        <div className="border border-gray-100 rounded-xl p-3">
                                          <p className="font-semibold text-gray-400 mb-1 flex items-center gap-1"><ClipboardCheck size={13} /> Completion</p>
                                          <p className="text-gray-700 leading-relaxed">{task.completion_criteria || task.definition_of_done}</p>
                                          {task.evidence_required && <p className="text-gray-400 mt-2">Evidence: {task.evidence_required}</p>}
                                        </div>
                                        <div className="border border-gray-100 rounded-xl p-3">
                                          <p className="font-semibold text-gray-400 mb-1 flex items-center gap-1"><AlertTriangle size={13} /> If missed</p>
                                          <p className="text-gray-700 leading-relaxed">{task.risk_if_missed || 'Downstream execution may be affected.'}</p>
                                          {task.contingency && <p className="text-gray-400 mt-2">Contingency: {task.contingency}</p>}
                                        </div>
                                        {task.approval_required && (
                                          <div className="border border-purple-100 bg-purple-50/30 rounded-xl p-3">
                                            <p className="font-semibold text-purple-700 mb-1">Approval gate</p>
                                            <p className="text-purple-700/70">Approver: {task.approver || 'Event lead'}</p>
                                          </div>
                                        )}
                                        {task.vendor_scope && (
                                          <div className="border border-blue-100 bg-blue-50/30 rounded-xl p-3">
                                            <p className="font-semibold text-blue-700 mb-1">Procurement scope · {task.procurement_category || 'Vendor'}</p>
                                            <p className="text-blue-700/70 leading-relaxed">{task.vendor_scope}</p>
                                          </div>
                                        )}
                                      </div>
                                    </details>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {planView === 'timeline' && planningStart && (
                  <GanttView tasks={tasks} eventDate={eventDate} planningStart={planningStart} eventName={eventName} />
                )}

                {planView === 'risks' && (
                  <div className="grid lg:grid-cols-2 gap-5">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6">
                      <h2 className="font-bold text-navy flex items-center gap-2 mb-5"><ShieldAlert size={18} /> High-impact risks</h2>
                      <div className="space-y-3">
                        {highRisks.length ? highRisks.map((task, index) => (
                          <div key={task.id || index} className={`rounded-xl border p-4 ${riskClasses(task.risk_level)}`}>
                            <p className="text-xs font-bold uppercase mb-1">{task.risk_level}</p>
                            <p className="font-semibold text-sm">{task.title}</p>
                            <p className="text-xs mt-2 opacity-80">{task.risk_if_missed}</p>
                            {task.contingency && <p className="text-xs mt-2 opacity-65">Contingency: {task.contingency}</p>}
                          </div>
                        )) : <p className="text-sm text-gray-400">No high-impact risks remain open.</p>}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-3xl p-6">
                      <h2 className="font-bold text-navy flex items-center gap-2 mb-5"><ClipboardCheck size={18} /> Approval gates</h2>
                      <div className="space-y-3">
                        {approvalGates.length ? approvalGates.map((task, index) => (
                          <div key={task.id || index} className="rounded-xl border border-purple-100 bg-purple-50/30 p-4">
                            <p className="font-semibold text-sm text-navy">{task.title}</p>
                            <p className="text-xs text-purple-700 mt-1">Approver: {task.approver || 'Event lead'}</p>
                            <p className="text-xs text-gray-400 mt-2">Blocks: {task.risk_if_missed || 'Downstream execution'}</p>
                          </div>
                        )) : <p className="text-sm text-gray-400">No approval gates remain open.</p>}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
