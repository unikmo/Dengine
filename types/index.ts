export type Scale = 'Intimate' | 'Medium' | 'Large' | 'Mega'
export type Layer = 'Promotion' | 'Setup' | 'Execution' | 'Cleanup'
export type BudgetLevel = 0 | 1 | 2 | 3 | 4 | 5

export const BUDGET_LABELS: Record<BudgetLevel, string> = {
  0: 'Volunteer',
  1: 'Budget',
  2: 'Balanced',
  3: 'Premium',
  4: 'Luxury',
  5: 'Extravagant',
}

export const BUDGET_DESCRIPTIONS: Record<BudgetLevel, string> = {
  0: 'Community-run. Everyone contributes one small task.',
  1: 'Minimal spend. DIY where possible.',
  2: 'Good quality at reasonable cost.',
  3: 'Elevated experience, professional vendors.',
  4: 'High-end, full professional team.',
  5: 'Money is secondary. Best possible experience.',
}

export const SCALE_DESCRIPTIONS: Record<Scale, string> = {
  Intimate: '15–50 people',
  Medium: '50–500 people',
  Large: '500–5,000 people',
  Mega: '5,000+ people',
}

export const LAYER_COLORS: Record<Layer, { bg: string; text: string; border: string; dot: string }> = {
  Promotion: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200', dot: '#3b82f6' },
  Setup: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', dot: '#f59e0b' },
  Execution: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200', dot: '#22c55e' },
  Cleanup: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: '#9ca3af' },
}

export interface Event {
  id: string
  name: string
  category: string
  subcategory: string
  scale: Scale
  blueprint: string
  luxury_base: number
  complexity: number
  planning_weeks: number
  description: string
  key_dimensions: string[]
  primary_cost: string
  key_risks: string[]
  intake_questions: string[]
  has_tasks: boolean
  created_at?: string
}

export interface Task {
  id: string
  event_id: string
  slot: number
  layer: Layer
  title: string
  time_minutes: number
  who: string
  definition_of_done: string
}

export interface IntakeAnswers {
  guest_count: number
  budget_level: BudgetLevel
  is_first_time: boolean
  is_volunteer_driven: boolean
  is_outdoor: boolean
  custom_answers: Record<string, string>
}

export interface GeneratedTask {
  layer: Layer
  title: string
  time_minutes: number
  who: string
  definition_of_done: string
  is_volunteer_claimable: boolean
  sub_project?: string
  weeks_before_event?: number
  target_date?: string
}

export interface SmartContext {
  city?: string
  country?: string
  spendType?: 'unknown' | 'volunteer' | 'amount'
  spendAmount?: number
  eventDate?: string
  planningStart?: string
}

export interface Blueprint {
  event: Event
  intake: IntakeAnswers
  tasks: GeneratedTask[]
  total_volunteer_hours: number
  is_pre_built: boolean
}

export interface ClaimedTask extends GeneratedTask {
  claimed_by?: string
  claimed_at?: string
}
