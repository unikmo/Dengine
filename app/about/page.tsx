import type { Metadata } from 'next'
import { ArrowRight, GitBranch, Layers3, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About DEngine',
  description:
    'DEngine is building event execution intelligence: structured software that turns professional event requirements into dependency-aware operating plans.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main className="bg-[#fbfaf7]">
      <section className="shell py-20 sm:py-24">
        <div className="max-w-4xl">
          <p className="eyebrow">About DEngine</p>
          <h1 className="display mt-4 text-5xl font-black leading-[1.01] sm:text-6xl">
            Event planning has plenty of task managers.
            <span className="block text-[#8b7440]">The missing layer is operational reasoning.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#6d7889]">
            DEngine is being built around a simple premise: professional event teams should not have to reconstruct the same hidden dependencies, lead times, approval gates and completion logic from memory every time a new event begins.
          </p>
        </div>
      </section>

      <section className="border-y border-black/[0.055] bg-[#f5f2ea] py-20">
        <div className="shell grid gap-5 md:grid-cols-3">
          {[
            [GitBranch, 'Model relationships', 'A task becomes more useful when the system knows what it depends on and what it blocks.'],
            [Layers3, 'Adapt event knowledge', 'Structured event models provide a professional starting point; AI adapts them to the specific context.'],
            [ShieldCheck, 'Make readiness observable', 'Owners, approvals, completion evidence and risks create a stronger definition of “ready.”'],
          ].map(([Icon, title, copy]: any) => (
            <article key={title} className="rounded-[26px] border border-black/[0.055] bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#15233f] text-[#efcd6d]">
                <Icon size={18} />
              </span>
              <h2 className="mt-5 text-lg font-black tracking-[-0.02em] text-[#23324a]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#707b8c]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow">Product direction</p>
            <h2 className="display mt-4 text-4xl font-black">Before Asana. Before Monday. Before the checklist.</h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-[#687386]">
            <p>
              DEngine is not trying to replace established project-management systems. Those products are excellent execution environments once the work has been defined.
            </p>
            <p>
              The product focus is upstream: determine the event operating model, construct the dependency graph, schedule backwards from the fixed date, surface readiness and produce a plan that can later move into the team&apos;s preferred workflow.
            </p>
            <p>
              The long-term defensibility comes from deeper event operating models, validated dependency logic, lead-time intelligence, conditional planning rules, procurement-ready specifications and historical execution data.
            </p>
          </div>
        </div>

        <div className="mt-16 rounded-[32px] bg-[#15233f] p-8 text-white sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#efcd6d]">Build a real event</p>
          <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="max-w-2xl text-3xl font-black tracking-[-0.035em]">
              The product should earn trust by making a real plan better.
            </h2>
            <a href="/custom" className="btn-signal shrink-0">
              Build an execution plan <ArrowRight className="ml-2" size={15} />
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
