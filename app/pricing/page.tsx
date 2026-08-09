import type { Metadata } from 'next'
import { ArrowRight, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Event Planning Software Pricing',
  description:
    'DEngine pricing for single professional events, event agencies and in-house event teams. Preview the event architecture free, then unlock a complete execution plan.',
  alternates: { canonical: '/pricing' },
}

const plans = [
  {
    name: 'Preview',
    price: '$0',
    suffix: '',
    eyebrow: 'Evaluate the model',
    copy: 'See whether DEngine understands the shape of your event before committing.',
    features: [
      'Event architecture overview',
      'Workstream preview',
      'Sample dependencies',
      'High-level backward timeline',
      'Sample risks and approvals',
    ],
    cta: 'Build a preview',
    href: '/custom',
    featured: false,
  },
  {
    name: 'Execution Plan',
    price: '$39',
    suffix: '/ event',
    eyebrow: 'For one professional event',
    copy: 'The complete dependency-aware operating plan for a single event.',
    features: [
      'Full tailored execution graph',
      'Workstreams, tasks and owner roles',
      'Dependencies and critical-path flags',
      'Backward-calculated deadlines',
      'Approval gates and approver roles',
      'Risks, consequences and contingencies',
      'Completion criteria and evidence',
      'Timeline / Gantt view',
    ],
    cta: 'Build my execution plan',
    href: '/custom',
    featured: true,
  },
  {
    name: 'Teams & Agencies',
    price: 'Custom',
    suffix: '',
    eyebrow: 'For repeat planning',
    copy: 'The recurring layer for teams that want DEngine embedded into how events are planned.',
    features: [
      'Multiple concurrent events',
      'Reusable organization event models',
      'Company-specific rules and approvals',
      'Portfolio readiness dashboard',
      'Preferred supplier structures',
      'Historical event data',
      'PM and calendar integrations',
      'White-label outputs',
    ],
    cta: 'Discuss team access',
    href: 'mailto:hello@dengine.app?subject=DEngine%20team%20access',
    featured: false,
  },
]

export default function PricingPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="shell pb-14 pt-20 text-center sm:pb-20 sm:pt-24">
        <p className="eyebrow">Pricing</p>
        <h1 className="display mx-auto mt-4 max-w-4xl text-5xl font-black leading-[1.01] sm:text-6xl">
          Prove the plan first.
          <span className="block text-[#8b7440]">Pay when the structure is useful.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6f7a8b]">
          One event should be easy to buy. Teams that plan repeatedly can move into reusable models,
          portfolio visibility and integrations.
        </p>
      </section>

      <section className="shell pb-24">
        <div className="grid items-start gap-5 lg:grid-cols-3">
          {plans.map(plan => (
            <article
              key={plan.name}
              className={`relative rounded-[30px] border p-7 sm:p-8 ${
                plan.featured
                  ? 'border-[#c9aa57] bg-[#15233f] text-white shadow-2xl shadow-[#15233f]/10'
                  : 'border-black/[0.06] bg-white'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-7 rounded-full bg-[#d8b65b] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#15233f]">
                  Core product
                </span>
              )}

              <p className={`text-[11px] font-black uppercase tracking-[0.13em] ${plan.featured ? 'text-[#efcd6d]' : 'text-[#9b7b2f]'}`}>
                {plan.eyebrow}
              </p>
              <h2 className="mt-3 text-xl font-black tracking-[-0.025em]">{plan.name}</h2>
              <p className="mt-5 text-4xl font-black tracking-[-0.04em]">
                {plan.price}{' '}
                {plan.suffix && <span className={`text-sm font-bold ${plan.featured ? 'text-white/35' : 'text-[#9aa1ad]'}`}>{plan.suffix}</span>}
              </p>
              <p className={`mt-4 min-h-[72px] text-sm leading-6 ${plan.featured ? 'text-white/58' : 'text-[#707b8c]'}`}>
                {plan.copy}
              </p>

              <div className={`my-7 h-px ${plan.featured ? 'bg-white/10' : 'bg-black/[0.06]'}`} />

              <ul className="space-y-3">
                {plan.features.map(feature => (
                  <li key={feature} className={`flex items-start gap-2.5 text-sm ${plan.featured ? 'text-white/72' : 'text-[#5f6d80]'}`}>
                    <Check size={15} className={`mt-0.5 shrink-0 ${plan.featured ? 'text-[#efcd6d]' : 'text-[#9b7b2f]'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a href={plan.href} className={`${plan.featured ? 'btn-signal' : 'btn-primary'} mt-8 w-full`}>
                {plan.cta} <ArrowRight className="ml-2" size={15} />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-[26px] border border-black/[0.055] bg-[#f5f2ea] p-6">
            <p className="text-sm font-black text-[#23324a]">Already use Asana, Monday or ClickUp?</p>
            <p className="mt-2 text-sm leading-6 text-[#6c7889]">
              Keep it. DEngine is positioned upstream: construct the event operating model first, then move execution into the project-management environment your team already uses.
            </p>
          </div>
          <div className="rounded-[26px] border border-black/[0.055] bg-[#f5f2ea] p-6">
            <p className="text-sm font-black text-[#23324a]">Why not price by event category?</p>
            <p className="mt-2 text-sm leading-6 text-[#6c7889]">
              A conference, gala and product launch do not need arbitrary product tiers. The value is in the depth of execution intelligence, not the label attached to the event.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
