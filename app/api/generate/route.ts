import { NextRequest, NextResponse } from 'next/server'
import { generateBlueprint } from '@/lib/anthropic'
import type { BudgetLevel, Event, IntakeAnswers, SmartContext } from '@/types'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_BODY_BYTES = 32_000
const RATE_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT = 5

type RateEntry = {
  count: number
  resetAt: number
}

const globalRateStore = globalThis as typeof globalThis & {
  __dengineRateStore?: Map<string, RateEntry>
}

const rateStore = globalRateStore.__dengineRateStore ?? new Map<string, RateEntry>()
globalRateStore.__dengineRateStore = rateStore

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function stringList(value: unknown, maxItems: number, maxLen: number) {
  return Array.isArray(value)
    ? value.slice(0, maxItems).map(item => text(item, maxLen)).filter(Boolean)
    : []
}

function getClientKey(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || req.headers.get('x-real-ip') || 'unknown'
}

function consumeRateLimit(key: string) {
  const now = Date.now()
  const current = rateStore.get(key)

  if (!current || current.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { allowed: true, remaining: RATE_LIMIT - 1, resetAt: now + RATE_WINDOW_MS }
  }

  if (current.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  rateStore.set(key, current)
  return { allowed: true, remaining: RATE_LIMIT - current.count, resetAt: current.resetAt }
}

function normalizeEvent(raw: any): Event | null {
  if (!raw || typeof raw !== 'object') return null

  const name = text(raw.name, 120)
  if (!name) return null

  const scale = ['Intimate', 'Medium', 'Large', 'Mega'].includes(raw.scale)
    ? raw.scale
    : 'Medium'

  return {
    id: text(raw.id, 80) || 'custom',
    name,
    category: text(raw.category, 100) || 'Professional Event',
    subcategory: text(raw.subcategory, 100) || 'Custom',
    scale,
    blueprint: text(raw.blueprint, 120) || 'Event Execution Graph',
    luxury_base: Math.max(0, Math.min(5, Number(raw.luxury_base) || 2)),
    complexity: Math.max(1, Math.min(5, Number(raw.complexity) || 3)),
    planning_weeks: Math.max(1, Math.min(104, Number(raw.planning_weeks) || 12)),
    description: text(raw.description, 1600),
    key_dimensions: stringList(raw.key_dimensions, 16, 120),
    primary_cost: text(raw.primary_cost, 220),
    key_risks: stringList(raw.key_risks, 20, 220),
    intake_questions: [],
    has_tasks: Boolean(raw.has_tasks),
  } as Event
}

function normalizeIntake(raw: any): IntakeAnswers | null {
  if (!raw || typeof raw !== 'object') return null

  const custom: Record<string, string> = {}
  if (raw.custom_answers && typeof raw.custom_answers === 'object') {
    Object.entries(raw.custom_answers)
      .slice(0, 12)
      .forEach(([key, value]) => {
        custom[text(key, 50)] = text(value, 1200)
      })
  }

  return {
    guest_count: Math.max(1, Math.min(1_000_000, Number(raw.guest_count) || 50)),
    budget_level: Math.max(0, Math.min(5, Number(raw.budget_level) || 2)) as BudgetLevel,
    is_first_time: Boolean(raw.is_first_time),
    is_volunteer_driven: Boolean(raw.is_volunteer_driven),
    is_outdoor: Boolean(raw.is_outdoor),
    custom_answers: custom,
  }
}

function normalizeSmart(raw: any): SmartContext | undefined {
  if (!raw || typeof raw !== 'object') return undefined

  const spendType: SmartContext['spendType'] = ['unknown', 'volunteer', 'amount'].includes(raw.spendType)
    ? raw.spendType
    : 'unknown'

  return {
    city: text(raw.city, 80) || undefined,
    country: text(raw.country, 80) || undefined,
    spendType,
    spendAmount: Number.isFinite(Number(raw.spendAmount))
      ? Math.max(0, Math.min(1_000_000, Number(raw.spendAmount)))
      : undefined,
    eventDate: /^\d{4}-\d{2}-\d{2}$/.test(text(raw.eventDate, 10))
      ? text(raw.eventDate, 10)
      : undefined,
    planningStart: /^\d{4}-\d{2}-\d{2}$/.test(text(raw.planningStart, 10))
      ? text(raw.planningStart, 10)
      : undefined,
  }
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get('content-length') || '0')
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: 'Request is too large.' },
      { status: 413, headers: { 'Cache-Control': 'no-store' } }
    )
  }

  const rate = consumeRateLimit(getClientKey(req))
  if (!rate.allowed) {
    const retryAfter = Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))
    return NextResponse.json(
      { error: 'Too many plan generations. Please try again shortly.' },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': String(retryAfter),
        },
      }
    )
  }

  try {
    const body = await req.json()
    const event = normalizeEvent(body?.event)
    const intake = normalizeIntake(body?.intake)
    const smart = normalizeSmart(body?.smart)

    if (!event || !intake) {
      return NextResponse.json(
        { error: 'Invalid event data.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const tasks = await generateBlueprint(event, intake, smart)

    return NextResponse.json(
      { tasks },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-RateLimit-Remaining': String(rate.remaining),
        },
      }
    )
  } catch (error) {
    console.error('Execution-plan generation failed', error)
    return NextResponse.json(
      { error: 'Plan generation failed. Please try again.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
