import Anthropic from '@anthropic-ai/sdk'
import { IntakeAnswers, GeneratedTask, Layer, Event, SmartContext, RiskLevel } from '@/types'
import { weeksBeforeToDate } from '@/lib/dates'

export { calculateSuggestedStart, formatDate, formatDateShort, weeksBeforeToDate } from '@/lib/dates'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function normaliseRisk(value: unknown): RiskLevel {
  return value === 'critical' || value === 'high' || value === 'medium' || value === 'low'
    ? value
    : 'medium'
}

export async function generateBlueprint(
  event: Event,
  intake: IntakeAnswers,
  smart?: SmartContext
): Promise<GeneratedTask[]> {
  const budgetLabels = ['Volunteer / zero-cost', 'Cost-efficient', 'Balanced', 'Premium', 'Luxury', 'Extravagant']
  const hasTimeline = Boolean(smart?.eventDate)

  const contextLines = [
    smart?.city && smart?.country ? `Location: ${smart.city}, ${smart.country}` : '',
    smart?.spendType === 'amount' && smart.spendAmount
      ? `Spend per guest: $${smart.spendAmount}`
      : smart?.spendType === 'volunteer'
      ? 'Spend per guest: volunteer / near-zero-cost'
      : '',
    smart?.eventDate ? `Fixed event date: ${smart.eventDate}` : '',
    smart?.planningStart ? `Planning start date: ${smart.planningStart}` : '',
  ].filter(Boolean).join('\n')

  const prompt = `You are the event-operations reasoning engine inside DEngine.

DEngine is NOT a checklist generator. It produces an Event Execution Graph: a professional operating model showing what must become true for the event to be ready, how work depends on other work, when it must happen, who owns it, which approvals gate progress, what proves completion, and what happens if it slips.

EVENT PROFILE
Name: ${event.name}
Category: ${event.category}
Scale: ${event.scale}
Event model: ${event.blueprint}
Description: ${event.description}
Operational dimensions: ${event.key_dimensions.join(', ')}
Primary cost driver: ${event.primary_cost}
Known risks: ${event.key_risks.join(', ')}
${contextLines}

EVENT CONTEXT
Guest count: ${intake.guest_count}
Budget: ${budgetLabels[intake.budget_level] ?? 'Balanced'} (${intake.budget_level}/5)
First time running this event: ${intake.is_first_time ? 'Yes' : 'No'}
Volunteer-driven: ${intake.is_volunteer_driven ? 'Yes' : 'No'}
Outdoor: ${intake.is_outdoor ? 'Yes' : 'No'}
Additional context: ${JSON.stringify(intake.custom_answers)}

PLANNING RULES
1. Produce 28–55 operational tasks. Prefer completeness and causal structure over generic advice.
2. Group tasks into 4–8 professional workstreams such as Venue & Logistics, Program & Speakers, Registration & Guest Experience, Production & AV, Marketing & Communications, Commercial / Sponsors, Finance & Procurement, Event-Day Operations.
3. Every task must have a unique stable id: T01, T02, T03...
4. Dependencies must reference only earlier task ids in this same output. Use [] where none exist.
5. Mark critical_path true only where delay is likely to create downstream schedule risk.
6. approval_required should be true only when an explicit decision or sign-off gates downstream work; include the likely approver role.
7. completion_criteria must be objectively testable. evidence_required should state what proves completion (approved file, signed contract, confirmation email, uploaded deck, final attendee list, etc.).
8. risk_if_missed must describe the operational consequence, not a generic warning.
9. contingency must be specific and usable.
10. procurement_category/vendor_scope are null unless an external purchase/vendor is genuinely relevant. If relevant, vendor_scope should be RFQ-ready enough to help source the requirement.
11. ${hasTimeline
    ? 'Assign weeks_before_event as an integer. 0 = event day. Schedule backwards from the fixed event date using realistic lead times and the dependency chain.'
    : 'Set weeks_before_event to null because no fixed event date is available.'}
12. If outdoor, hybrid, confidential, regulated, high-attendance, or otherwise operationally special, activate the relevant conditional tasks.
13. Use Promotion / Setup / Execution / Cleanup only as broad reporting layers; workstream is the more meaningful professional grouping.
14. Keep task titles action-oriented and specific.
15. Do not invent legal requirements as facts. Where a permit, insurance or compliance check may be relevant, phrase the task as verifying the applicable requirement.

Return ONLY a valid JSON array. No markdown. Each item must follow this exact shape:
[
  {
    "id": "T01",
    "layer": "Setup",
    "workstream": "Venue & Logistics",
    "title": "Lock the final room layout",
    "description": "Confirm stage, seating, registration, catering and accessibility zones against the approved attendance assumption.",
    "time_minutes": 90,
    "who": "Event Operations Lead",
    "depends_on": ["T00"],
    "approval_required": true,
    "approver": "Event Director",
    "completion_criteria": "A final floorplan is approved with no unresolved room-use conflicts.",
    "evidence_required": "Approved floorplan PDF with version date",
    "risk_level": "high",
    "risk_if_missed": "AV design, signage quantities and supplier load-in planning remain blocked.",
    "contingency": "Freeze a provisional layout and flag only the unresolved zones for controlled revision.",
    "critical_path": true,
    "procurement_category": null,
    "vendor_scope": null,
    "weeks_before_event": 8,
    "is_volunteer_claimable": false
  }
]`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('')

  const clean = text.replace(/```json|```/g, '').trim()

  try {
    const raw = JSON.parse(clean) as any[]

    return raw.map((task, index) => {
      const completion = String(task.completion_criteria || task.definition_of_done || 'Task completed and verified')
      const weeks = Number.isFinite(task.weeks_before_event) ? Number(task.weeks_before_event) : undefined

      return {
        id: String(task.id || `T${String(index + 1).padStart(2, '0')}`),
        layer: (['Promotion', 'Setup', 'Execution', 'Cleanup'].includes(task.layer) ? task.layer : 'Setup') as Layer,
        title: String(task.title || `Execution task ${index + 1}`),
        description: task.description ? String(task.description) : undefined,
        time_minutes: Number(task.time_minutes) || 30,
        who: String(task.who || 'Event Lead'),
        definition_of_done: completion,
        is_volunteer_claimable: Boolean(task.is_volunteer_claimable),
        sub_project: String(task.workstream || task.sub_project || 'Event Operations'),
        workstream: String(task.workstream || task.sub_project || 'Event Operations'),
        depends_on: Array.isArray(task.depends_on) ? task.depends_on.map(String) : [],
        approval_required: Boolean(task.approval_required),
        approver: task.approver ? String(task.approver) : undefined,
        completion_criteria: completion,
        evidence_required: task.evidence_required ? String(task.evidence_required) : undefined,
        risk_level: normaliseRisk(task.risk_level),
        risk_if_missed: task.risk_if_missed ? String(task.risk_if_missed) : undefined,
        contingency: task.contingency ? String(task.contingency) : undefined,
        critical_path: Boolean(task.critical_path),
        procurement_category: task.procurement_category ? String(task.procurement_category) : null,
        vendor_scope: task.vendor_scope ? String(task.vendor_scope) : null,
        weeks_before_event: weeks,
        target_date:
          smart?.eventDate && weeks != null
            ? weeksBeforeToDate(smart.eventDate, weeks)
            : undefined,
      }
    })
  } catch (error) {
    console.error('Failed to parse execution graph', error)
    return [
      {
        id: 'T01',
        layer: 'Setup',
        title: 'Execution-plan generation failed — please try again',
        time_minutes: 0,
        who: 'System',
        definition_of_done: 'A valid execution plan is generated',
        completion_criteria: 'A valid execution plan is generated',
        risk_level: 'critical',
        risk_if_missed: 'No execution architecture is available.',
        contingency: 'Retry generation. If the issue persists, contact support.',
        critical_path: true,
        depends_on: [],
        is_volunteer_claimable: false,
      },
    ]
  }
}
