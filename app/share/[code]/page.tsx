'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LAYER_COLORS } from '@/types'
import type { GeneratedTask, Layer } from '@/types'

const layers: Layer[] = ['Promotion', 'Setup', 'Execution', 'Cleanup']

export default function SharePage({ params }: { params: { code: string } }) {
  const [blueprint, setBlueprint] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('blueprints')
      .select('*')
      .eq('share_code', params.code)
      .single()
      .then(({ data, error }) => {
        if (error) console.error('[share] fetch error:', error)
        setBlueprint(data)
        setLoading(false)
      })
  }, [params.code])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading blueprint...</div>
      </div>
    )
  }

  if (!blueprint) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-6">
        <div>
          <p className="text-gray-500 mb-4">We couldn't find that blueprint.</p>
          <a href="/custom" className="text-navy underline text-sm">Build your own →</a>
        </div>
      </div>
    )
  }

  const tasks: GeneratedTask[] = blueprint.tasks || []
  const totalMinutes = tasks.reduce((s: number, t: GeneratedTask) => s + t.time_minutes, 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  const tasksByLayer = layers.reduce((acc, l) => {
    acc[l] = tasks.filter(t => t.layer === l)
    return acc
  }, {} as Record<string, GeneratedTask[]>)

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy mb-1">{blueprint.event_name}</h1>
        <p className="text-gray-400 text-sm">
          {tasks.length} tasks · {totalHours}h · {blueprint.guest_count} guests
        </p>
      </div>

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
                {lt.map((task, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{task.who}</p>
                        <p className="text-xs text-gray-400 mt-1 italic">{task.definition_of_done}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${colors.bg} ${colors.text}`}>
                        {task.time_minutes} min
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 mb-3">Planned with Dengine</p>
        <a
          href="/custom"
          className="inline-block bg-navy text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-navy/90 transition-colors"
        >
          Build your own blueprint →
        </a>
      </div>
    </main>
  )
}
