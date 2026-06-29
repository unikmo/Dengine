'use client'
import { useEffect, useState } from 'react'
import { ChevronRight, Clock, Download } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Event, Task } from '@/types'
import { LAYER_COLORS } from '@/types'

const COMPLEXITY_STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)
const layers = ['Promotion', 'Setup', 'Execution', 'Cleanup'] as const

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
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <a href="/" className="hover:text-navy">Home</a>
        <ChevronRight size={14} />
        <a href="/browse" className="hover:text-navy">{event.category}</a>
        <ChevronRight size={14} />
        <span className="text-navy font-medium">{event.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-block bg-gold/20 text-navy text-xs font-semibold px-3 py-1 rounded-full mb-3">
          {event.category}
        </div>
        <h1 className="text-3xl font-bold text-navy mb-2">{event.name}</h1>
        <p className="text-gray-500 text-sm mb-4">{event.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>Scale: <strong className="text-gray-800">{event.scale}</strong></span>
          <span>Complexity: <strong className="text-amber-500">{COMPLEXITY_STARS(event.complexity)}</strong></span>
          <span>Plan ahead: <strong className="text-gray-800">{event.planning_weeks === 0 ? 'Anytime' : `${event.planning_weeks} weeks`}</strong></span>
          {tasks.length > 0 && (
            <span><strong className="text-navy">{tasks.length} tasks</strong> · {totalHours}h total</span>
          )}
        </div>
      </div>

      {/* Tasks — the main content */}
      {tasks.length > 0 ? (
        <>
          {/* Claim bar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="text-sm text-gray-500 flex-shrink-0">Your name:</span>
            <input
              type="text"
              value={claimName}
              onChange={e => setClaimName(e.target.value)}
              placeholder="Enter your name to claim tasks"
              className="flex-1 text-sm border-0 outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
            {claimName && (
              <span className="text-xs text-green-600 font-medium">
                {Object.keys(claimedBy).length} claimed
              </span>
            )}
          </div>

          <div className="space-y-8 mb-10">
            {layers.map(layer => {
              const lt = tasksByLayer[layer] || []
              if (!lt.length) return null
              const colors = LAYER_COLORS[layer]
              return (
                <div key={layer}>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg mb-4 text-sm font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {layer}
                    <span className="font-normal opacity-60">({lt.length})</span>
                  </div>
                  <div className="space-y-2">
                    {lt.map(task => {
                      const claimed = claimedBy[task.id]
                      return (
                        <div
                          key={task.id}
                          onClick={() => !claimed && claimTask(task.id)}
                          className={`bg-white rounded-xl border p-4 transition-all ${
                            claimed
                              ? 'border-green-300 bg-green-50'
                              : claimName
                                ? 'border-gray-200 hover:border-navy/30 cursor-pointer hover:shadow-sm'
                                : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                              <p className="text-xs text-gray-500 mt-1">{task.who}</p>
                              <p className="text-xs text-gray-400 mt-1 italic">{task.definition_of_done}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} flex items-center gap-1`}>
                                <Clock size={10} />{task.time_minutes} min
                              </span>
                              {claimed ? (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ {claimed}</span>
                              ) : claimName ? (
                                <span className="text-xs text-gray-400">tap to claim</span>
                              ) : null}
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

          {/* PDF lead capture */}
          <div className="bg-navy text-white rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Download this blueprint</h2>
            <p className="text-white/60 text-sm mb-6">Get the full task list as a PDF — free. No account needed.</p>
            {emailSubmitted ? (
              <p className="text-green-400 font-medium">Downloading now — check your print dialog.</p>
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
                <button type="submit" className="bg-gold text-navy font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-gold/90 transition-colors">
                  <Download size={16} /> Get PDF
                </button>
              </form>
            )}
          </div>

          {/* Custom blueprint CTA */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need something tailored to your specific setup?{' '}
              <a href="/custom" className="text-navy font-medium hover:underline">
                Build a custom blueprint →
              </a>
            </p>
          </div>
        </>
      ) : (
        /* No pre-built tasks yet */
        <div className="text-center py-16">
          <p className="text-gray-500 mb-2">We haven't built the task list for this event yet.</p>
          <a href="/custom" className="text-navy font-medium hover:underline text-sm">
            Describe your event and we'll generate one →
          </a>
        </div>
      )}
    </main>
  )
}
