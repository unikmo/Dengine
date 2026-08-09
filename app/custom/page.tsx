'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardCheck,
  GitBranch,
  Layers3,
  MapPin,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { calculateSuggestedStart, weeksBeforeToDate } from '@/lib/dates'
import type { BudgetLevel, Event, GeneratedTask, SmartContext } from '@/types'

const GanttView = dynamic(() => import('@/components/GanttView'), { ssr: false })

type Step = 1 | 2 | 3
type PlanView = 'graph' | 'timeline' | 'risks'
type VenueFormat = 'indoor' | 'outdoor' | 'mixed' | 'hybrid'
type VenueStatus = 'confirmed' | 'shortlist' | 'searching' | 'unknown'

const OPERATING_LEVELS: { value: BudgetLevel; label: string; detail: string }[] = [
  { value: 0, label: 'Volunteer-led', detail: 'Minimal paid support' },
  { value: 1, label: 'Lean', detail: 'Cost-controlled delivery' },
  { value: 2, label: 'Balanced', detail: 'Typical professional mix' },
  { value: 3, label: 'Premium', detail: 'Elevated suppliers + experience' },
  { value: 4, label: 'Luxury', detail: 'High-end delivery' },
  { value: 5, label: 'Best available', detail: 'Quality over cost' },
]

function taskId(task: GeneratedTask, index: number) {
  return task.id || `T${String(index + 1).padStart(2, '0')}`
}

function riskClasses(level?: string) {
  switch (level) {
    case 'critical': return 'border-red-200 bg-red-50 text-red-700'
    case 'high': return 'border-orange-200 bg-orange-50 text-orange-700'
    case 'medium': return 'border-amber-200 bg-amber-50 text-amber-700'
    default: return 'border-gray-200 bg-gray-50 text-gray-500'
  }
}

function StepRail({ step }: { step: Step }) {
  const items = [
    ['1', 'Event brief'],
    ['2', 'Operating context'],
    ['3', 'Execution plan'],
  ]

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {items.map(([number, label], index) => {
        const value = (index + 1) as Step
        const active = step === value
        const done = step > value
        return (
          <div key={number} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${
              active ? 'bg-[#15233f] text-white' : done ? 'bg-[#e9e2ce] text-[#80631f]' : 'bg-white text-[#929aa6]'
            }`}>
              <span>{done ? <Check size={12} /> : number}</span>
              <span className="whitespace-nowrap">{label}</span>
            </div>
            {index < 2 && <span className="h-px w-5 bg-[#d8d4ca]" />}
          </div>
        )
      })}
    </div>
  )
}

function OutputPreview() {
  return (
    <aside className="rounded-[28px] bg-[#15233f] p-6 text-white lg:sticky lg:top-28">
      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#efcd6d]">What DEngine will model</p>
      <h2 className="mt-3 text-2xl font-black tracking-[-0.035em]">Not a checklist. An operating model.</h2>
      <div className="mt-6 space-y-4">
        {[
          [GitBranch, 'Dependencies', 'What must happen first and what becomes blocked.'],
          [CalendarDays, 'Backward timing', 'Target dates anchored to event day.'],
          [ClipboardCheck, 'Approval + completion gates', 'Who signs off and what proves the item is done.'],
          [ShieldAlert, 'Operational risk', 'Consequence of delay and contingency where possible.'],
        ].map(([Icon, title, desc]: any) => (
          <div key={title} className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-[#efcd6d]">
              <Icon size={16} />
            </span>
            <div>
              <p className="text-sm font-black">{title}</p>
              <p className="mt-1 text-xs leading-5 text-white/42">{desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 border-t border-white/10 pt-5">
        <p className="text-xs leading-5 text-white/38">
          You do not need an account to build the preview. Account creation should only be required later for persistent saving, collaboration or paid features.
        </p>
      </div>
    </aside>
  )
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
        'program and content',
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
    if (!eventName.trim() || !eventDate || !objective.trim()) return

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

  const briefValid = Boolean(eventName.trim() && eventDate && objective.trim())

  return (
    <main className="min-h-screen bg-[#f5f2ea]">
      <div className="shell py-9 sm:py-12">
        <div className="mb-7">
          <StepRail step={step} />
        </div>

        {step !== 3 && (
          <div className="mb-9 max-w-3xl">
            <p className="eyebrow">Build an event execution plan</p>
            <h1 className="display mt-4 text-4xl font-black leading-[1.03] sm:text-5xl">
              Start with the outcome and the fixed date.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6d7889]">
              DEngine uses your operating context to determine what must become true before the event can be considered ready.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <section className="panel p-6 sm:p-8">
              <div className="flex items-start gap-3 border-b border-black/[0.055] pb-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2e7c7] text-[#80631f]">
                  <Sparkles size={18} />
                </span>
                <div>
                  <h2 className="text-lg font-black tracking-[-0.025em] text-[#23324a]">Event brief</h2>
                  <p className="mt-1 text-sm text-[#7a8596]">What is happening, when, and what must it achieve?</p>
                </div>
              </div>

              <div className="mt-7 space-y-6">
                <div className="relative">
                  <label className="label">Event type or working name</label>
                  <Search size={16} className="absolute left-4 top-[46px] text-[#9ca4b0]" />
                  <input
                    value={eventName}
                    onChange={e => {
                      setEventName(e.target.value.slice(0, 120))
                      setMatchedEvent(null)
                    }}
                    maxLength={120}
                    placeholder="e.g. European Customer Conference"
                    className="input pl-11"
                  />

                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-2xl">
                      <p className="bg-[#f7f5ef] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#9299a5]">
                        Reference models found
                      </p>
                      {suggestions.map(event => (
                        <button
                          type="button"
                          key={event.id}
                          onClick={() => selectEvent(event)}
                          className="flex w-full items-center justify-between border-t border-black/[0.045] px-4 py-3 text-left transition-colors hover:bg-[#fbfaf7]"
                        >
                          <div>
                            <p className="text-sm font-black text-[#23324a]">{event.name}</p>
                            <p className="mt-0.5 text-xs text-[#8b94a2]">{event.category}</p>
                          </div>
                          <ChevronRight size={15} className="text-[#a3aab4]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label">Fixed event date</label>
                    <div className="relative">
                      <CalendarDays size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca4b0]" />
                      <input
                        type="date"
                        value={eventDate}
                        onChange={e => setEventDate(e.target.value)}
                        className="input pl-11"
                      />
                    </div>
                    <p className="field-help">This anchors the backward schedule.</p>
                  </div>
                  <div>
                    <label className="label">Expected attendees</label>
                    <div className="relative">
                      <Users size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca4b0]" />
                      <input
                        type="number"
                        min="1"
                        max="1000000"
                        value={guestCount}
                        onChange={e => setGuestCount(e.target.value)}
                        className="input pl-11"
                      />
                    </div>
                    <p className="field-help">Used to infer event scale and operational load.</p>
                  </div>
                </div>

                <div>
                  <label className="label">What must this event achieve?</label>
                  <textarea
                    value={objective}
                    onChange={e => setObjective(e.target.value.slice(0, 1200))}
                    maxLength={1200}
                    placeholder="Example: Educate 400 enterprise clients, launch the new platform, give sales qualified follow-up opportunities, and deliver a premium in-person experience."
                    className="input min-h-36 resize-y"
                  />
                  <div className="mt-1.5 flex justify-between text-xs text-[#98a0ac]">
                    <span>Specific outcomes create a stronger execution model.</span>
                    <span>{objective.length}/1200</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!briefValid}
                  onClick={() => setStep(2)}
                  className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Add operating context <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </section>

            <OutputPreview />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <section className="panel p-6 sm:p-8">
              <div className="flex items-start gap-3 border-b border-black/[0.055] pb-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2e7c7] text-[#80631f]">
                  <Layers3 size={18} />
                </span>
                <div>
                  <h2 className="text-lg font-black tracking-[-0.025em] text-[#23324a]">Operating context</h2>
                  <p className="mt-1 text-sm text-[#7a8596]">These assumptions change the tasks, lead times and risks DEngine should consider.</p>
                </div>
              </div>

              <div className="mt-7 space-y-7">
                <div>
                  <label className="label">Delivery format</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(['indoor', 'outdoor', 'mixed', 'hybrid'] as VenueFormat[]).map(value => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setEventFormat(value)}
                        className={`rounded-2xl border px-3 py-3 text-sm font-black capitalize transition-all ${
                          eventFormat === value
                            ? 'border-[#15233f] bg-[#15233f] text-white'
                            : 'border-[#ddd9cf] bg-white text-[#6f7a8b] hover:border-[#bdb7aa]'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Venue status</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {([
                      ['confirmed', 'Confirmed'],
                      ['shortlist', 'Shortlisted'],
                      ['searching', 'Searching'],
                      ['unknown', 'Not decided'],
                    ] as [VenueStatus, string][]).map(([value, label]) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setVenueStatus(value)}
                        className={`rounded-2xl border px-3 py-3 text-sm font-black transition-all ${
                          venueStatus === value
                            ? 'border-[#9d7c2f] bg-[#f0e5c5] text-[#6f551d]'
                            : 'border-[#ddd9cf] bg-white text-[#6f7a8b] hover:border-[#bdb7aa]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="label">City</label>
                    <div className="relative">
                      <MapPin size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca4b0]" />
                      <input value={city} maxLength={80} onChange={e => setCity(e.target.value.slice(0, 80))} placeholder="Berlin" className="input pl-11" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <input value={country} maxLength={80} onChange={e => setCountry(e.target.value.slice(0, 80))} placeholder="Germany" className="input" />
                  </div>
                  <div>
                    <label className="label">Core planning team</label>
                    <input type="number" min="1" max="500" value={teamSize} onChange={e => setTeamSize(e.target.value)} className="input" />
                  </div>
                </div>

                <div>
                  <label className="label">Operating level</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {OPERATING_LEVELS.map(option => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setBudgetLevel(option.value)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          budgetLevel === option.value
                            ? 'border-[#9d7c2f] bg-[#fbf6e7]'
                            : 'border-[#ddd9cf] bg-white hover:border-[#bdb7aa]'
                        }`}
                      >
                        <p className="text-sm font-black text-[#26344c]">{option.label}</p>
                        <p className="mt-1 text-xs text-[#8b94a2]">{option.detail}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/[0.055] bg-[#f8f6f0] p-4">
                  <input
                    type="checkbox"
                    checked={firstTime}
                    onChange={e => setFirstTime(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#15233f]"
                  />
                  <span>
                    <span className="block text-sm font-black text-[#26344c]">First time running this event</span>
                    <span className="mt-1 block text-xs leading-5 text-[#858e9c]">
                      Add extra validation, supplier vetting and preparation work that an experienced repeat team may skip.
                    </span>
                  </span>
                </label>

                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary sm:w-auto">
                    <ArrowLeft className="mr-2" size={15} /> Back
                  </button>
                  <button type="button" onClick={generatePlan} className="btn-signal flex-1">
                    Build execution plan <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </div>
            </section>

            <OutputPreview />
          </div>
        )}

        {step === 3 && (
          <section>
            <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow">Event Execution Graph</p>
                <h1 className="display mt-3 text-4xl font-black sm:text-5xl">{eventName}</h1>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-[#768192]">
                  <span className="flex items-center gap-1.5"><Users size={14} /> {guestCount} attendees</span>
                  <span className="flex items-center gap-1.5"><Layers3 size={14} /> {eventFormat}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {eventDate}</span>
                  {city && <span className="flex items-center gap-1.5"><MapPin size={14} /> {city}</span>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary !px-4 !py-2.5">
                  Update assumptions
                </button>
                <button type="button" onClick={generatePlan} className="btn-primary !px-4 !py-2.5">
                  <RefreshCw className="mr-2" size={14} /> Regenerate
                </button>
              </div>
            </div>

            {generating && (
              <div className="panel p-12 text-center sm:p-16">
                <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-[#ece8df] border-t-[#9d7c2f]" />
                <h2 className="mt-5 text-xl font-black tracking-[-0.025em] text-[#23324a]">Building the event operating model</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#7c8695]">
                  Mapping workstreams, dependencies, approvals, risks, completion criteria and backward deadlines.
                </p>
              </div>
            )}

            {!generating && generationError && (
              <div className="rounded-[24px] border border-red-100 bg-red-50 p-6 text-red-700">
                <p className="font-black">Plan generation failed</p>
                <p className="mt-1 text-sm">{generationError}</p>
                <button type="button" onClick={generatePlan} className="mt-4 rounded-full bg-red-700 px-4 py-2 text-sm font-black text-white">
                  Try again
                </button>
              </div>
            )}

            {!generating && tasks.length > 0 && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-[24px] bg-[#15233f] p-5 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">Execution readiness</p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <span className="text-4xl font-black tracking-[-0.04em] text-[#efcd6d]">{readiness}%</span>
                      <span className="text-xs font-bold text-white/35">
                        {Object.values(completed).filter(Boolean).length}/{tasks.length} complete
                      </span>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-[#efcd6d] transition-all" style={{ width: `${readiness}%` }} />
                    </div>
                  </div>

                  {[
                    ['Critical tasks open', outstandingCritical.length, 'Weighted more heavily in readiness.'],
                    ['Approval gates open', approvalGates.length, 'Explicit decisions that gate downstream work.'],
                    ['High / critical risks', highRisks.length, 'Open items with material operational consequence.'],
                  ].map(([label, value, desc]) => (
                    <div key={String(label)} className="metric">
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#969da8]">{label}</p>
                      <p className="mt-3 text-3xl font-black tracking-[-0.035em] text-[#23324a]">{value}</p>
                      <p className="mt-2 text-xs leading-5 text-[#8a93a2]">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-col justify-between gap-4 rounded-[24px] border border-black/[0.055] bg-white p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2e7c7] text-[#80631f]">
                      <CalendarDays size={17} />
                    </span>
                    <div>
                      <p className="text-sm font-black text-[#23324a]">Move event day</p>
                      <p className="mt-1 text-xs text-[#8a93a2]">Backward target dates shift immediately from the same timing model.</p>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => shiftEventDate(e.target.value)}
                    className="rounded-xl border border-[#ddd9cf] bg-[#fbfaf7] px-3 py-2.5 text-sm font-bold text-[#37445a]"
                  />
                </div>

                <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                  {([
                    ['graph', 'Execution graph', GitBranch],
                    ['timeline', 'Backward timeline', CalendarDays],
                    ['risks', 'Risks + approvals', ShieldAlert],
                  ] as [PlanView, string, any][]).map(([value, label, Icon]) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setPlanView(value)}
                      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-black transition-colors ${
                        planView === value
                          ? 'bg-[#15233f] text-white'
                          : 'border border-black/[0.055] bg-white text-[#697587]'
                      }`}
                    >
                      <Icon size={15} /> {label}
                    </button>
                  ))}
                </div>

                {planView === 'graph' && (
                  <div className="mt-5 space-y-5">
                    {workstreams.map(([workstream, workstreamTasks]) => (
                      <div key={workstream} className="overflow-hidden rounded-[28px] border border-black/[0.055] bg-white">
                        <div className="flex items-center justify-between gap-4 border-b border-black/[0.055] bg-[#fbfaf7] px-5 py-4 sm:px-6">
                          <div>
                            <h2 className="font-black tracking-[-0.02em] text-[#23324a]">{workstream}</h2>
                            <p className="mt-1 text-xs text-[#8d96a4]">Operational workstream</p>
                          </div>
                          <span className="rounded-full bg-[#eee8d7] px-2.5 py-1 text-[10px] font-black text-[#816621]">
                            {workstreamTasks.length} tasks
                          </span>
                        </div>

                        <div className="divide-y divide-black/[0.055]">
                          {workstreamTasks.map(task => {
                            const globalIndex = tasks.indexOf(task)
                            const id = taskId(task, globalIndex)
                            const done = Boolean(completed[id])

                            return (
                              <article key={id} className={`p-5 sm:p-6 ${done ? 'bg-emerald-50/25' : ''}`}>
                                <div className="flex items-start gap-4">
                                  <button type="button" onClick={() => toggleComplete(task, globalIndex)} className="mt-0.5 shrink-0" aria-label={done ? 'Mark incomplete' : 'Mark complete'}>
                                    {done
                                      ? <CheckCircle2 size={22} className="text-emerald-600" />
                                      : <Circle size={22} className="text-[#c6cbd2]" />
                                    }
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                      <span className="text-[10px] font-black tracking-[0.08em] text-[#a0a7b1]">{id}</span>
                                      {task.critical_path && (
                                        <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-red-700">Critical</span>
                                      )}
                                      {task.approval_required && (
                                        <span className="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-violet-700">Approval</span>
                                      )}
                                      {task.risk_level && (
                                        <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] ${riskClasses(task.risk_level)}`}>
                                          {task.risk_level}
                                        </span>
                                      )}
                                    </div>

                                    <h3 className={`text-[16px] font-black tracking-[-0.015em] text-[#23324a] ${done ? 'line-through opacity-55' : ''}`}>
                                      {task.title}
                                    </h3>
                                    {task.description && <p className="mt-1.5 max-w-4xl text-sm leading-6 text-[#707b8c]">{task.description}</p>}

                                    <div className="mt-4 grid gap-2 md:grid-cols-3">
                                      <div className="rounded-xl bg-[#f7f5ef] p-3">
                                        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#9aa1ac]">Owner</p>
                                        <p className="mt-1 text-xs font-black text-[#4c596c]">{task.who}</p>
                                      </div>
                                      <div className="rounded-xl bg-[#f7f5ef] p-3">
                                        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#9aa1ac]">Target date</p>
                                        <p className="mt-1 text-xs font-black text-[#4c596c]">
                                          {task.target_date
                                            ? new Date(task.target_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : 'Not scheduled'}
                                        </p>
                                      </div>
                                      <div className="rounded-xl bg-[#f7f5ef] p-3">
                                        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-[#9aa1ac]">Depends on</p>
                                        <p className="mt-1 text-xs font-black text-[#4c596c]">{task.depends_on?.length ? task.depends_on.join(', ') : 'No prerequisite'}</p>
                                      </div>
                                    </div>

                                    <details className="group mt-4">
                                      <summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs font-black text-[#80631f]">
                                        Operational detail
                                        <ChevronRight size={13} className="transition-transform group-open:rotate-90" />
                                      </summary>

                                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                                        <div className="rounded-xl border border-black/[0.055] p-3.5">
                                          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#969da8]">
                                            <ClipboardCheck size={13} /> Definition of done
                                          </p>
                                          <p className="mt-2 text-xs leading-5 text-[#596678]">{task.completion_criteria || task.definition_of_done}</p>
                                          {task.evidence_required && <p className="mt-2 text-xs leading-5 text-[#8a93a2]"><strong>Evidence:</strong> {task.evidence_required}</p>}
                                        </div>

                                        <div className="rounded-xl border border-black/[0.055] p-3.5">
                                          <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.08em] text-[#969da8]">
                                            <AlertTriangle size={13} /> If missed
                                          </p>
                                          <p className="mt-2 text-xs leading-5 text-[#596678]">{task.risk_if_missed || 'Downstream execution may be affected.'}</p>
                                          {task.contingency && <p className="mt-2 text-xs leading-5 text-[#8a93a2]"><strong>Contingency:</strong> {task.contingency}</p>}
                                        </div>

                                        {task.approval_required && (
                                          <div className="rounded-xl border border-violet-100 bg-violet-50/45 p-3.5">
                                            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-violet-700">Approval gate</p>
                                            <p className="mt-2 text-xs leading-5 text-violet-700/75">Approver: {task.approver || 'Event lead'}</p>
                                          </div>
                                        )}

                                        {task.vendor_scope && (
                                          <div className="rounded-xl border border-sky-100 bg-sky-50/45 p-3.5">
                                            <p className="text-[10px] font-black uppercase tracking-[0.08em] text-sky-700">
                                              Procurement scope · {task.procurement_category || 'Vendor'}
                                            </p>
                                            <p className="mt-2 text-xs leading-5 text-sky-700/75">{task.vendor_scope}</p>
                                          </div>
                                        )}
                                      </div>
                                    </details>
                                  </div>
                                </div>
                              </article>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {planView === 'timeline' && planningStart && (
                  <div className="mt-5">
                    <GanttView tasks={tasks} eventDate={eventDate} planningStart={planningStart} eventName={eventName} />
                  </div>
                )}

                {planView === 'risks' && (
                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    <div className="panel p-6">
                      <h2 className="flex items-center gap-2 font-black tracking-[-0.02em] text-[#23324a]">
                        <ShieldAlert size={18} /> High-impact risks
                      </h2>
                      <div className="mt-5 space-y-3">
                        {highRisks.length ? highRisks.map((task, index) => (
                          <div key={task.id || index} className={`rounded-xl border p-4 ${riskClasses(task.risk_level)}`}>
                            <p className="text-[9px] font-black uppercase tracking-[0.1em]">{task.risk_level}</p>
                            <p className="mt-1 text-sm font-black">{task.title}</p>
                            <p className="mt-2 text-xs leading-5 opacity-80">{task.risk_if_missed}</p>
                            {task.contingency && <p className="mt-2 text-xs leading-5 opacity-65"><strong>Contingency:</strong> {task.contingency}</p>}
                          </div>
                        )) : <p className="text-sm text-[#8a93a2]">No high-impact risks remain open.</p>}
                      </div>
                    </div>

                    <div className="panel p-6">
                      <h2 className="flex items-center gap-2 font-black tracking-[-0.02em] text-[#23324a]">
                        <ClipboardCheck size={18} /> Approval gates
                      </h2>
                      <div className="mt-5 space-y-3">
                        {approvalGates.length ? approvalGates.map((task, index) => (
                          <div key={task.id || index} className="rounded-xl border border-violet-100 bg-violet-50/45 p-4">
                            <p className="text-sm font-black text-[#23324a]">{task.title}</p>
                            <p className="mt-1 text-xs text-violet-700">Approver: {task.approver || 'Event lead'}</p>
                            <p className="mt-2 text-xs leading-5 text-[#8a93a2]">Consequence: {task.risk_if_missed || 'Downstream execution remains blocked.'}</p>
                          </div>
                        )) : <p className="text-sm text-[#8a93a2]">No approval gates remain open.</p>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-7 rounded-[28px] border border-[#dfd2aa] bg-[#fbf6e7] p-6">
                  <p className="text-sm font-black text-[#5f4b1f]">Important: date changes recalculate target dates immediately.</p>
                  <p className="mt-2 max-w-4xl text-xs leading-5 text-[#8b7440]">
                    Changes to attendance, format or venue status currently require regeneration so DEngine can reassess which tasks and risks should exist. The interface does not pretend those structural changes are already deterministic.
                  </p>
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
