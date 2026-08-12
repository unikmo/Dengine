import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { generateBlueprint } from '@/lib/anthropic'
import { encryptPlan } from '@/lib/plan-vault'
import { createServerClient } from '@/lib/supabase-server'
import type { BudgetLevel, Event, IntakeAnswers, SmartContext } from '@/types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_BODY_BYTES = 32_000
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT = 5

type RateEntry = { count: number; resetAt: number }
const globalRateStore = globalThis as typeof globalThis & { __dengineRateStore?: Map<string, RateEntry> }
const rateStore = globalRateStore.__dengineRateStore ?? new Map<string, RateEntry>()
globalRateStore.__dengineRateStore = rateStore

function text(value: unknown, max: number) { return typeof value === 'string' ? value.trim().slice(0, max) : '' }
function stringList(value: unknown, maxItems: number, maxLen: number) {
  return Array.isArray(value) ? value.slice(0, maxItems).map(item => text(item, maxLen)).filter(Boolean) : []
}
function getClientKey(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}
function consumeRateLimit(key: string) {
  const now = Date.now(); const current = rateStore.get(key)
  if (!current || current.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { allowed: true }
  }
  if (current.count >= RATE_LIMIT) return { allowed: false }
  current.count += 1; rateStore.set(key, current)
  return { allowed: true }
}
function normalizeEvent(raw: any): Event | null {
  if (!raw || typeof raw !== 'object') return null
  const name = text(raw.name, 120); if (!name) return null
  const scale = ['Intimate','Medium','Large','Mega'].includes(raw.scale) ? raw.scale : 'Medium'
  return {
    id: text(raw.id,80) || 'custom', name,
    category: text(raw.category,100) || 'Professional Event', subcategory: text(raw.subcategory,100) || 'Custom',
    scale, blueprint: 'Event Execution Graph', luxury_base: Math.max(0,Math.min(5,Number(raw.luxury_base)||2)),
    complexity: Math.max(1,Math.min(5,Number(raw.complexity)||3)), planning_weeks: Math.max(1,Math.min(104,Number(raw.planning_weeks)||12)),
    description: text(raw.description,1600), key_dimensions: stringList(raw.key_dimensions,16,120),
    primary_cost: text(raw.primary_cost,220), key_risks: stringList(raw.key_risks,20,220), intake_questions: [], has_tasks: Boolean(raw.has_tasks),
  } as Event
}
function normalizeIntake(raw: any): IntakeAnswers | null {
  if (!raw || typeof raw !== 'object') return null
  const custom: Record<string,string> = {}
  if (raw.custom_answers && typeof raw.custom_answers === 'object') {
    Object.entries(raw.custom_answers).slice(0,12).forEach(([k,v]) => { custom[text(k,50)] = text(v,1200) })
  }
  return {
    guest_count: Math.max(1,Math.min(1_000_000,Number(raw.guest_count)||50)),
    budget_level: Math.max(0,Math.min(5,Number(raw.budget_level)||2)) as BudgetLevel,
    is_first_time: Boolean(raw.is_first_time), is_volunteer_driven: Boolean(raw.is_volunteer_driven), is_outdoor: Boolean(raw.is_outdoor), custom_answers: custom,
  }
}
function normalizeSmart(raw: any): SmartContext | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  return {
    city: text(raw.city,80) || undefined, country: text(raw.country,80) || undefined,
    spendType: ['unknown','volunteer','amount'].includes(raw.spendType) ? raw.spendType : 'unknown',
    eventDate: /^\d{4}-\d{2}-\d{2}$/.test(text(raw.eventDate,10)) ? text(raw.eventDate,10) : undefined,
    planningStart: /^\d{4}-\d{2}-\d{2}$/.test(text(raw.planningStart,10)) ? text(raw.planningStart,10) : undefined,
  } as SmartContext
}
function recommend(tasks: any[], intake: IntakeAnswers) {
  const workstreams = new Set(tasks.map(t => t.workstream || t.sub_project || 'Event Operations')).size
  const approvals = tasks.filter(t => t.approval_required).length
  const seriousRisks = tasks.filter(t => ['high','critical'].includes(t.risk_level)).length
  const critical = tasks.filter(t => t.critical_path).length
  let score = 0
  if (tasks.length > 30) score += 2
  if (workstreams >= 5) score += 1
  if (approvals >= 3) score += 1
  if (seriousRisks >= 3) score += 1
  if (critical >= 5) score += 1
  if (intake.guest_count >= 300) score += 1
  if (intake.is_first_time) score += 1
  if (intake.is_outdoor) score += 1
  if (intake.custom_answers?.venue_status !== 'confirmed') score += 1
  return score >= 5 ? 'professional' : 'essential'
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get('content-length') || '0')
  if (contentLength > MAX_BODY_BYTES) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 })
  if (!consumeRateLimit(getClientKey(req)).allowed) return NextResponse.json({ error: 'Too many plan generations. Please try again shortly.' }, { status: 429 })

  try {
    const body = await req.json()
    const event = normalizeEvent(body?.event); const intake = normalizeIntake(body?.intake); const smart = normalizeSmart(body?.smart)
    if (!event || !intake) return NextResponse.json({ error: 'Invalid event data.' }, { status: 400 })

    const tasks = await generateBlueprint(event, intake, smart)
    const recommendedTier = recommend(tasks, intake)
    const draftToken = randomUUID()
    const vault = encryptPlan({ event, intake, smart, tasks })
    const workstreams = new Set(tasks.map((t:any) => t.workstream || t.sub_project || 'Event Operations')).size
    const summary = {
      taskCount: tasks.length,
      workstreamCount: workstreams,
      approvals: tasks.filter((t:any) => t.approval_required).length,
      highRisks: tasks.filter((t:any) => ['high','critical'].includes(t.risk_level)).length,
      criticalPath: tasks.filter((t:any) => t.critical_path).length,
    }
    const previewTasks = tasks.slice(0,6).map((t:any) => ({
      id: t.id, title: t.title, workstream: t.workstream || t.sub_project, who: t.who,
      weeks_before_event: t.weeks_before_event, target_date: t.target_date, critical_path: t.critical_path,
    }))

    const preview = { tasks: previewTasks, summary }
    const eventSummary = { name: event.name, eventDate: smart?.eventDate, guestCount: intake.guest_count, city: smart?.city, country: smart?.country }
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
    const supabase = createServerClient()
    const { error } = await supabase.rpc('dengine_store_preview_draft', {
      p_draft_token: draftToken,
      p_plan_ciphertext: vault.ciphertext,
      p_plan_iv: vault.iv,
      p_plan_tag: vault.tag,
      p_preview: preview,
      p_event_summary: eventSummary,
      p_recommended_tier: recommendedTier,
      p_expires_at: expiresAt,
    })
    if (error) throw error

    return NextResponse.json({ draftToken, recommendedTier, summary, previewTasks }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Execution-plan generation failed', error)
    return NextResponse.json({ error: 'Plan generation failed. Please try again.' }, { status: 500 })
  }
}
