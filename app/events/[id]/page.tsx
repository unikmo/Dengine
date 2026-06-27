'use client'
import { useEffect, useState } from 'react'
import { Clock, Users, Star, ChevronRight, Zap, Printer } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Event, Task, IntakeAnswers, GeneratedTask, BudgetLevel } from '@/types'
import { BUDGET_LABELS, BUDGET_DESCRIPTIONS, SCALE_DESCRIPTIONS, LAYER_COLORS } from '@/types'

const COMPLEXITY_STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
const BUDGET_ICONS = ['🌱', '⚖️', '🏅', '💎', '👑']

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [preTasks, setPreTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [blueprint, setBlueprint] = useState<GeneratedTask[]>([])
  const [claimedBy, setClaimedBy] = useState<Record<number, string>>({})
  const [claimName, setClaimName] = useState('')
  const [shareCode, setShareCode] = useState<string | null>(null)

  const [intake, setIntake] = useState<IntakeAnswers>({
    guest_count: 50, budget_level: 0, is_first_time: false,
    is_volunteer_driven: true, is_outdoor: false, custom_answers: {}
  })

  useEffect(() => {
    async function load() {
      const { data: ev } = await supabase.from('events').select('*').eq('id', params.id).single()
      if (ev) {
        setEvent(ev)
        setIntake(prev => ({ ...prev, is_volunteer_driven: ev.complexity <= 3 }))
      }
      if (ev?.has_tasks) {
        const { data: tasks } = await supabase.from('tasks').select('*')
          .eq('event_id', params.id).order('slot')
        if (tasks) setPreTasks(tasks)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  async function generateBlueprint() {
    if (!event) return
    setGenerating(true)
    setBlueprint([])

    // Use pre-built tasks if available, adjusted for intake
    if (event.has_tasks && preTasks.length > 0) {
      const mapped: GeneratedTask[] = preTasks.map(t => ({
        layer: t.layer, title: t.title, time_minutes: t.time_minutes,
        who: t.who, definition_of_done: t.definition_of_done,
        is_volunteer_claimable: t.time_minutes <= 15
      }))
      setBlueprint(mapped)
      await saveBlueprint(mapped)
      setGenerating(false)
      return
    }

    // AI generation for events without pre-built tasks
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, intake })
      })
      const data = await res.json()
      if (data.tasks) {
        setBlueprint(data.tasks)
        await saveBlueprint(data.tasks)
      }
    } catch (e) {
      console.error(e)
    }
    setGenerating(false)
  }

  async function saveBlueprint(tasks: GeneratedTask[]) {
    if (!event) return
    const { data } = await supabase.from('blueprints').insert({
      event_id: event.id, event_name: event.name,
      guest_count: intake.guest_count, budget_level: intake.budget_level,
      is_first_time: intake.is_first_time, is_volunteer_driven: intake.is_volunteer_driven,
      is_outdoor: intake.is_outdoor, tasks
    }).select('share_code').single()
    if (data) setShareCode(data.share_code)
  }

  function claimTask(idx: number) {
    const name = claimName.trim() || 'Anonymous'
    setClaimedBy(prev => ({ ...prev, [idx]: name }))
  }

  const layers = ['Promotion', 'Setup', 'Execution', 'Cleanup'] as const
  const tasksByLayer = layers.reduce((acc, layer) => {
    acc[layer] = blueprint.filter(t => t.layer === layer)
    return acc
  }, {} as Record<string, GeneratedTask[]>)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Loading event...</div>
    </div>
  )
  if (!event) return <div className="p-10 text-center text-gray-500">Event not found.</div>

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-navy">Home</a>
        <ChevronRight size={14} />
        <a href={`/browse/${encodeURIComponent(event.category)}`} className="hover:text-navy">{event.category}</a>
        <ChevronRight size={14} />
        <span className="text-navy font-medium">{event.name}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Event info + intake */}
        <div className="md:col-span-1 space-y-6">
          {/* Event card */}
          <div className="card p-6">
            <div className="badge bg-gold/30 text-navy mb-3">{event.category}</div>
            <h1 className="text-2xl font-bold text-navy mb-2">{event.name}</h1>
            <p className="text-gray-600 text-sm mb-4">{event.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Scale</span>
                <span className="font-medium">{event.scale} <span className="text-gray-400">({SCALE_DESCRIPTIONS[event.scale]})</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Complexity</span>
                <span className="font-medium text-amber-500">{COMPLEXITY_STARS(event.complexity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plan ahead</span>
                <span className="font-medium">{event.planning_weeks === 0 ? 'Anytime' : `${event.planning_weeks} weeks`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Luxury base</span>
                <span className="font-medium">{['Normal','Premium','Luxury','Lux+','Extravagant','Exceptional'][event.luxury_base]}</span>
              </div>
              {event.has_tasks && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Pre-built tasks</span>
                  <span className="font-medium text-green-600">✓ {preTasks.length} tasks ready</span>
                </div>
              )}
            </div>

            {event.key_risks?.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                <div className="text-xs font-semibold text-amber-700 mb-1">Key risks</div>
                <div className="text-xs text-amber-600">{event.key_risks.join(' · ')}</div>
              </div>
            )}
          </div>

          {/* Intake form */}
          <div className="card p-6">
            <h2 className="font-bold text-navy text-lg mb-5">Configure your blueprint</h2>
            
            <div className="space-y-5">
              <div>
                <label className="label">Expected guests</label>
                <div className="flex items-center gap-3">
                  <input type="range" min="5" max="5000" value={intake.guest_count}
                    onChange={e => setIntake(p => ({ ...p, guest_count: +e.target.value }))}
                    className="flex-1 accent-navy" />
                  <span className="font-bold text-navy w-16 text-right">{intake.guest_count.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="label">Budget approach</label>
                <div className="grid grid-cols-5 gap-1">
                  {([0,1,2,3,4] as BudgetLevel[]).map(level => (
                    <button key={level} onClick={() => setIntake(p => ({ ...p, budget_level: level }))}
                      className={`p-2 rounded-lg text-center text-xs font-medium transition-all ${
                        intake.budget_level === level
                          ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      <div className="text-lg">{BUDGET_ICONS[level]}</div>
                      <div>{BUDGET_LABELS[level]}</div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">{BUDGET_DESCRIPTIONS[intake.budget_level]}</p>
              </div>

              <div className="space-y-3">
                {[
                  ['is_first_time', '🆕 First time running this event?'],
                  ['is_volunteer_driven', '🙌 Volunteer-driven (15-min tasks)?'],
                  ['is_outdoor', '🌤️ Outdoor event?'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox"
                      checked={intake[key as keyof IntakeAnswers] as boolean}
                      onChange={e => setIntake(p => ({ ...p, [key]: e.target.checked }))}
                      className="w-4 h-4 accent-navy" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>

              {/* Event-specific questions */}
              {event.intake_questions?.length > 0 && (
                <div>
                  <label className="label">Event-specific details</label>
                  <div className="space-y-2">
                    {event.intake_questions.map((q, i) => (
                      <input key={i} type="text" placeholder={q}
                        onChange={e => setIntake(p => ({
                          ...p, custom_answers: { ...p.custom_answers, [q]: e.target.value }
                        }))}
                        className="input text-sm" />
                    ))}
                  </div>
                </div>
              )}

              <button onClick={generateBlueprint} disabled={generating}
                className="btn-gold w-full justify-center text-base py-4 disabled:opacity-60">
                {generating ? (
                  <><span className="animate-spin">⚡</span> Generating...</>
                ) : event.has_tasks ? (
                  <><Zap size={18} /> Load blueprint ({preTasks.length} tasks)</>
                ) : (
                  <><Zap size={18} /> Generate with AI</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Blueprint output */}
        <div className="md:col-span-2">
          {blueprint.length === 0 ? (
            <div className="card p-12 text-center text-gray-400">
              <div className="text-5xl mb-4">⚡</div>
              <div className="font-semibold text-lg text-gray-600 mb-2">Your blueprint will appear here</div>
              <div className="text-sm">Configure your event on the left and click Generate</div>
            </div>
          ) : (
            <div>
              {/* Blueprint header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-navy">{event.name} Blueprint</h2>
                  <p className="text-sm text-gray-500">
                    {blueprint.length} tasks · {Math.round(blueprint.reduce((s,t) => s+t.time_minutes, 0)/60*10)/10} volunteer hours
                    {intake.is_volunteer_driven && ' · All ≤15 min'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {shareCode && (
                    <button onClick={() => navigator.clipboard.writeText(`${window.location.origin}/share/${shareCode}`)}
                      className="text-sm text-navy border border-navy/30 px-3 py-2 rounded-lg hover:bg-navy/5">
                      Copy share link
                    </button>
                  )}
                  <button onClick={() => window.print()} className="btn-primary text-sm py-2">
                    <Printer size={16} /> Print
                  </button>
                </div>
              </div>

              {/* Volunteer claim bar */}
              {intake.is_volunteer_driven && (
                <div className="card p-4 mb-6 flex items-center gap-3">
                  <Users size={16} className="text-navy flex-shrink-0" />
                  <input type="text" value={claimName} onChange={e => setClaimName(e.target.value)}
                    placeholder="Your name — then click any task to claim it"
                    className="input text-sm py-2 flex-1" />
                </div>
              )}

              {/* Tasks by layer */}
              <div className="space-y-6">
                {layers.map(layer => {
                  const layerTasks = tasksByLayer[layer] || []
                  if (layerTasks.length === 0) return null
                  const colors = LAYER_COLORS[layer]
                  return (
                    <div key={layer}>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${colors.bg} ${colors.text} border ${colors.border}`}>
                        <span className="font-bold text-sm">{layer}</span>
                        <span className="text-xs opacity-70">({layerTasks.length} tasks)</span>
                      </div>
                      <div className="space-y-2">
                        {layerTasks.map((task, i) => {
                          const globalIdx = blueprint.indexOf(task)
                          const claimed = claimedBy[globalIdx]
                          return (
                            <div key={i}
                              className={`card p-4 cursor-pointer transition-all ${claimed ? 'border-green-300 bg-green-50' : 'hover:border-navy/20'}`}
                              onClick={() => intake.is_volunteer_driven && !claimed && claimTask(globalIdx)}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-900 text-sm">{task.title}</div>
                                  <div className="text-xs text-gray-500 mt-1">{task.who}</div>
                                  <div className="text-xs text-gray-400 mt-1 italic">{task.definition_of_done}</div>
                                </div>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                  <span className={`badge ${colors.bg} ${colors.text}`}>
                                    <Clock size={10} className="mr-1" />{task.time_minutes} min
                                  </span>
                                  {claimed ? (
                                    <span className="badge bg-green-100 text-green-700">✓ {claimed}</span>
                                  ) : intake.is_volunteer_driven && (
                                    <span className="badge bg-gray-100 text-gray-500">tap to claim</span>
                                  )}
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
