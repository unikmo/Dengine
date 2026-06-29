'use client'
import { useEffect, useState } from 'react'
import { ChevronRight, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Event, Task } from '@/types'
import { LAYER_COLORS } from '@/types'

const layers = ['Promotion', 'Setup', 'Execution', 'Cleanup'] as const

const SCALE_RANGE: Record<string, string> = {
  Intimate: '15–50 people',
  Medium: '50–500 people',
  Large: '500–5,000 people',
  Mega: '5,000+ people',
}

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [claimedBy, setClaimedBy] = useState<Record<string, string>>({})
  const [claimName, setClaimName] = useState('')

  useEffect(() => {
    async function load() {
      const { data: ev } = await supabase.from('events').select('*').eq('id', params.id).single()
      if (!ev) { setLoading(false); return }
      setEvent(ev)
      if (ev.has_tasks) {
        const { data: t } = await supabase.from('tasks').select('*')
          .eq('event_id', params.id).order('slot')
        if (t) setTasks(t)
      }
      setLoading(false)
    }
    load()
  }, [params.id])

  const tasksByLayer = layers.reduce((acc, layer) => {
    acc[layer] = tasks.filter(t => t.layer === layer)
    return acc
  }, {} as Record<string, Task[]>)

  const totalMinutes = tasks.reduce((s, t) => s + t.time_minutes, 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  function claimTask(taskId: string) {
    const name = claimName.trim()
    if (!name) return
    setClaimedBy(prev => ({ ...prev, [taskId]: name }))
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setEmailSubmitted(true)
    window.print()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400 animate-pulse">Loading…</div>
    </div>
  )
  if (!event) return <div className="p-10 text-center text-gray-500">Event not found.</div>

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
        <a href="/browse" className="hover:text-navy transition-colors">Browse</a>
        <ChevronRight size={14} />
        <a href={`/browse/${encodeURIComponent(event.category)}`} className="hover:text-navy transition-colors">
          {event.category}
        </a>
        <ChevronRight size={14} />
        <span className="text-navy font-medium">{event.name}</span>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-navy mb-3">{event.name}</h1>
      <p className="text-gray-500 text-sm mb-6">{event.description}</p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-6 text-sm mb-10 pb-8 border-b border-gray-100">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Scale</div>
          <div className="font-semibold text-gray-800">{event.scale} <span className="font-normal text-gray-400 text-xs">({SCALE_RANGE[event.scale]})</span></div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Complexity</div>
          <div className="font-semibold text-amber-500">{'★'.repeat(event.complexity)}{'☆'.repeat(5 - event.complexity)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Plan ahead</div>
          <div className="font-semibold text-gray-800">{event.planning_weeks === 0 ? 'Anytime' : `${event.planning_weeks} weeks`}</div>
        </div>
        {tasks.length > 0 && (
          <>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Tasks</div>
              <div className="font-semibold text-gray-800">{tasks.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Total time</div>
              <div className="font-semibold text-gray-800">{totalHours}h</div>
            </div>
          </>
        )}
      </div>

      {tasks.length > 0 ? (
        <>
          {/* Claim name input */}
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 mb-8 flex items-center gap-3">
            <span className="text-sm text-gray-400 flex-shrink-0">Your name:</span>
            <input
              type="text"
              value={claimName}
              onChange={e => setClaimName(e.target.value)}
              placeholder="Enter name to claim a task"
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-300"
            />
          </div>

          {/* Task table per layer */}
          <div className="space-y-10 mb-12">
            {layers.map(layer => {
              const lt = tasksByLayer[layer] || []
              if (!lt.length) return null
              const colors = LAYER_COLORS[layer]
              return (
                <div key={layer}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold mb-4 ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {layer} <span className="font-normal opacity-60">({lt.length})</span>
                  </div>

                  {/* Header row */}
                  <div className="grid grid-cols-[2rem_1fr_8rem_5rem] gap-3 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <div>#</div>
                    <div>Task</div>
                    <div>Owner</div>
                    <div className="text-right">Time</div>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {lt.map((task, i) => {
                      const claimed = claimedBy[task.id]
                      return (
                        <div
                          key={task.id}
                          onClick={() => !claimed && claimTask(task.id)}
                          className={`grid grid-cols-[2rem_1fr_8rem_5rem] gap-3 px-4 py-4 transition-all ${
                            claimed
                              ? 'bg-green-50'
                              : claimName
                                ? 'hover:bg-gray-50 cursor-pointer'
                                : ''
                          }`}
                        >
                          <div className="text-xs font-bold text-gray-300 pt-0.5">{task.slot ?? i + 1}</div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{task.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5 italic">{task.definition_of_done}</div>
                            {claimed && (
                              <div className="text-xs text-green-600 font-medium mt-1">✓ Claimed by {claimed}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 pt-0.5">{task.who}</div>
                          <div className={`text-sm font-semibold text-right pt-0.5 ${colors.text}`}>
                            {task.time_minutes} min
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* PDF / lead capture */}
          <div className="bg-navy text-white rounded-2xl p-8 text-center">
            <h2 className="text-lg font-bold mb-1">Download this blueprint</h2>
            <p className="text-white/50 text-sm mb-6">Free PDF with all tasks, owners, and times.</p>
            {emailSubmitted ? (
              <p className="text-green-400 font-medium text-sm">Opening print dialog…</p>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex gap-3 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl text-navy text-sm outline-none"
                />
                <button type="submit" className="bg-gold text-navy font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-yellow-300 transition-colors whitespace-nowrap">
                  <Download size={15} /> Get PDF
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Need it tailored to your setup?{' '}
              <a href="/custom" className="text-navy font-medium hover:underline">Build a custom blueprint →</a>
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-3">No task breakdown yet for this event.</p>
          <a href="/custom" className="text-navy font-medium hover:underline text-sm">
            Describe it and we'll generate one →
          </a>
        </div>
      )}
    </main>
  )
}
