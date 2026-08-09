import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'DEngine pricing for single professional events, teams and event agencies.',
}

const plans = [
  {
    name: 'Preview',
    price: '$0',
    suffix: '',
    description: 'Validate the structure before you pay.',
    features: [
      'Event architecture overview',
      'Workstream preview',
      'Sample dependency chain',
      'High-level backward timeline',
      'Sample risks and approval gates',
    ],
    cta: 'Build a preview',
    href: '/custom',
  },
  {
    name: 'Execution Plan',
    price: '$39',
    suffix: '/ event',
    description: 'The complete operating model for one event.',
    featured: true,
    features: [
      'Full tailored execution plan',
      'Workstreams, tasks and owners',
      'Dependencies and critical-task flags',
      'Backward-calculated deadlines',
      'Approval gates',
      'Risks and contingencies',
      'Completion criteria and evidence',
      'Timeline / Gantt view',
      'PDF / spreadsheet-ready structure',
    ],
    cta: 'Build my execution plan',
    href: '/custom',
  },
  {
    name: 'Teams & Agencies',
    price: 'Custom',
    suffix: '',
    description: 'For organisations planning events repeatedly.',
    features: [
      'Multiple concurrent events',
      'Reusable company event models',
      'Organisation-specific rules',
      'Portfolio readiness dashboard',
      'Approvals and team roles',
      'Preferred suppliers',
      'Historical event data',
      'PM and calendar integrations',
      'White-label outputs',
    ],
    cta: 'Talk to us',
    href: 'mailto:hello@dengine.app',
  },
]

export default function PricingPage() {
  return (
    <main className="bg-white">
      <section className="bg-[#0f1729] text-white px-6 py-20 text-center">
        <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-4">Pricing</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">Pay for the plan. Subscribe when you repeat.</h1>
        <p className="text-white/55 text-lg max-w-2xl mx-auto">
          Single-event pricing keeps the first purchase easy. Teams and agencies move to recurring workflows when DEngine becomes part of how they operate.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-3xl p-8 border ${plan.featured ? 'border-gold shadow-lg shadow-black/[0.04]' : 'border-gray-100'} relative`}>
              {plan.featured && (
                <div className="absolute -top-3 left-8 bg-gold text-navy text-xs font-bold px-4 py-1.5 rounded-full">Core product</div>
              )}
              <p className="font-bold text-navy text-xl mb-2">{plan.name}</p>
              <p className="text-4xl font-bold text-navy mb-2">
                {plan.price} <span className="text-sm font-medium text-gray-400">{plan.suffix}</span>
              </p>
              <p className="text-sm text-gray-500 min-h-12 mb-7">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map(feature => (
                  <li key={feature} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-gold font-bold mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a href={plan.href} className={`block text-center py-3 rounded-xl font-bold text-sm ${plan.featured ? 'bg-gold text-navy hover:bg-yellow-300' : 'bg-navy text-white hover:bg-navy/90'} transition-colors`}>
                {plan.cta} →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#f5f0e8] p-7">
            <h2 className="font-bold text-navy text-lg mb-2">Why not charge by event category?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              A wedding, gala and conference do not need different arbitrary product tiers. DEngine prices the depth of execution intelligence, not the label attached to the event.
            </p>
          </div>
          <div className="rounded-2xl bg-[#f5f0e8] p-7">
            <h2 className="font-bold text-navy text-lg mb-2">Already use Asana, Monday or ClickUp?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Keep it. DEngine is designed to create the event operating model first, then hand execution into the project-management environment your team already uses.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
