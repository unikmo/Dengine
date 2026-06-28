import Anthropic from '@anthropic-ai/sdk'
import { IntakeAnswers, GeneratedTask, Layer, Event, SmartContext } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export function calculateSuggestedStart(eventDate: string, planningWeeks: number): string {
  const d = new Date(eventDate)
  d.setDate(d.getDate() - planningWeeks * 7)
  return d.toISOString().split('T')[0]
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

export function weeksBeforeToDate(eventDate: string, weeksBefore: number): string {
  const d = new Date(eventDate)
  d.setDate(d.getDate() - weeksBefore * 7)
  return d.toISOString().split('T')[0]
}

export async function generateBlueprint(
  event: Event,
  intake: IntakeAnswers,
  smart?: SmartContext
): Promise<GeneratedTask[]> {
  const budgetLabels = ['Cost-Efficient', 'Balanced', 'Premium', 'Luxury', 'Extravagant']

  const locationLine = smart?.city && smart?.country
    ? `Location: ${smart.city}, ${smart.country}`
    : ''

  const spendLine =
    smart?.spendType === 'amount' && smart.spendAmount
      ? `Spend per guest: $${smart.spendAmount}`
      : smart?.spendType === 'volunteer'
      ? 'Spend per guest: Volunteer/zero-cost'
      : ''

  const eventDateLine = smart?.eventDate
    ? `Event date: ${smart.eventDate}`
    : ''

  const planningStartLine = smart?.planningStart
    ? `Planning start date: ${smart.planningStart}`
    : ''

  const hasTimeline = !!(smart?.eventDate)

  const prompt = `You are an expert event planner using the Event Engine framework.

EVENT: ${event.name}
Category: ${event.category} | Scale: ${event.scale} | Blueprint type: ${event.blueprint}
Description: ${event.description}
Key operational dimensions: ${event.key_dimensions.join(', ')}
Primary cost driver: ${event.primary_cost}
Key risks: ${event.key_risks.join(', ')}
${locationLine}
${spendLine}
${eventDateLine}
${planningStartLine}

INTAKE ANSWERS:
- Guest count: ${intake.guest_count}
- Budget level: ${budgetLabels[intake.budget_level] ?? budgetLabels[0]} (${intake.budget_level}/5)
- First time running this event: ${intake.is_first_time ? 'Yes — add extra preparation tasks' : 'No — assume experience'}
- Volunteer-driven: ${intake.is_volunteer_driven ? 'Yes — ALL tasks must be 15 minutes or less, independently claimable' : 'No — tasks can be role-based and longer'}
- Outdoor: ${intake.is_outdoor ? 'Yes — include weather contingency tasks' : 'No'}

Generate a complete task breakdown for this event. Organize tasks across these 4 layers:
- Promotion (pre-event communication, marketing, registration)
- Setup (venue, equipment, logistics preparation)
- Execution (day-of running, staffing, management)
- Cleanup (teardown, follow-up, documentation)

${intake.is_volunteer_driven
  ? 'CRITICAL: This is volunteer-driven. Every task MUST be 15 minutes or less. Each task must be independently claimable — someone can say "I will do this one thing" without needing to know anything else. Use specific, concrete language. Include a clear Definition of Done.'
  : 'Tasks can be role-based and take longer. Include specialist roles where appropriate.'}

Budget level ${intake.budget_level} means:
${intake.budget_level === 0 ? '- Minimize cost, DIY where possible, maximum volunteer involvement' : ''}
${intake.budget_level === 1 ? '- Minimal spend, volunteer-first' : ''}
${intake.budget_level === 2 ? '- Good quality, reasonable spend, mix of volunteer and paid services' : ''}
${intake.budget_level === 3 ? '- Quality-focused, some professional services, elevated experience' : ''}
${intake.budget_level === 4 ? '- High-end, professional vendors, premium experience throughout' : ''}
${intake.budget_level === 5 ? '- Money is secondary, best possible experience, full professional team' : ''}

${intake.is_first_time ? 'Add extra preparation tasks (research, site visits, vendor vetting) that experienced teams would skip.' : ''}

GROUP tasks into 3–6 logical sub-projects (e.g. "Venue & Logistics", "Marketing & Comms", "On-the-day Ops", "Budget & Finance", "Volunteer Coordination"). Every task must belong to a sub_project.

${hasTimeline
  ? 'TIMELINE: Assign weeks_before_event to each task (integer: how many weeks before the event date this task should be done). Use 0 for event-day tasks, positive integers for tasks done before. A 4-week planning window would have most tasks between 0 and 4. Spread tasks sensibly across the timeline.'
  : 'Set weeks_before_event: null for all tasks (no event date provided).'}

Respond ONLY with a JSON array of tasks. No preamble, no explanation. Format:
[
  {
    "layer": "Promotion",
    "title": "Draft 3-sentence announcement for class chats",
    "time_minutes": 15,
    "who": "Any board member",
    "definition_of_done": "Announcement text approved and ready to post",
    "is_volunteer_claimable": true,
    "sub_project": "Marketing & Comms",
    "weeks_before_event": 4
  }
]`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')

  const clean = text.replace(/```json|```/g, '').trim()

  try {
    const tasks = JSON.parse(clean) as GeneratedTask[]

    // If event date provided, calculate target_date for each task
    if (smart?.eventDate) {
      return tasks.map(t => ({
        ...t,
        target_date:
          t.weeks_before_event != null
            ? weeksBeforeToDate(smart.eventDate!, t.weeks_before_event)
            : undefined,
      }))
    }

    return tasks
  } catch {
    return [
      {
        layer: 'Promotion' as Layer,
        title: 'Blueprint generation failed — please try again',
        time_minutes: 0,
        who: 'System',
        definition_of_done: 'Contact support if this persists',
        is_volunteer_claimable: false,
      },
    ]
  }
}
