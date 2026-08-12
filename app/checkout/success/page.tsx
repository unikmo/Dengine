import { CheckCircle2, GitBranch, ShieldAlert } from 'lucide-react'
import { getStripe } from '@/lib/stripe'
import { getServerSupabase } from '@/lib/supabase-server'
import { decryptPlan } from '@/lib/plan-vault'

export const dynamic = 'force-dynamic'

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  if (!session_id) return <main className="shell py-20"><h1 className="display text-4xl font-black">Payment session missing.</h1></main>

  const session = await getStripe().checkout.sessions.retrieve(session_id)
  if (session.payment_status !== 'paid') return <main className="shell py-20"><h1 className="display text-4xl font-black">Payment is still being confirmed.</h1><p className="mt-4 text-[#687386]">Refresh this page after payment confirmation.</p></main>
  const draftToken = session.metadata?.draft_token
  const tier = session.metadata?.tier === 'professional' ? 'professional' : 'essential'
  if (!draftToken) return <main className="shell py-20"><h1 className="display text-4xl font-black">Plan reference missing.</h1></main>

  const supabase = getServerSupabase()
  const { data: draft } = await supabase.from('dengine_plan_drafts').select('*').eq('draft_token', draftToken).single()
  if (!draft) return <main className="shell py-20"><h1 className="display text-4xl font-black">Your plan could not be loaded.</h1></main>
  await supabase.from('dengine_orders').update({ status: 'paid', verified_at: new Date().toISOString(), customer_email: session.customer_details?.email || null }).eq('stripe_checkout_session_id', session.id)

  const plan = decryptPlan(draft) as any
  const tasks = Array.isArray(plan.tasks) ? plan.tasks : []
  const groups = new Map<string, any[]>()
  tasks.forEach((task:any) => {
    const name = task.workstream || task.sub_project || 'Event Operations'
    groups.set(name, [...(groups.get(name) || []), task])
  })

  return (
    <main className="bg-[#fbfaf7] pb-24">
      <section className="border-b border-black/[0.055] bg-[#15233f] text-white">
        <div className="shell py-14 sm:py-18">
          <div className="flex items-center gap-3 text-[#efcd6d]"><CheckCircle2 size={22}/><span className="text-xs font-black uppercase tracking-[0.14em]">Payment confirmed</span></div>
          <h1 className="display mt-4 text-4xl font-black sm:text-5xl">{plan.event?.name || 'Your event'} execution plan</h1>
          <p className="mt-4 max-w-3xl text-white/60">{tier === 'professional' ? 'Professional execution intelligence unlocked: dependencies, approvals, risks, contingencies and critical-path detail.' : 'Essential execution plan unlocked: complete task coverage, owners, timing, dependencies and completion criteria.'}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-white/65"><span className="rounded-full bg-white/10 px-3 py-2">{tasks.length} tasks</span><span className="rounded-full bg-white/10 px-3 py-2">{groups.size} workstreams</span><span className="rounded-full bg-white/10 px-3 py-2">{tier === 'professional' ? '$39 Professional' : '$19 Essential'}</span></div>
        </div>
      </section>

      <div className="shell mt-10 space-y-8">
        {Array.from(groups.entries()).map(([workstream, items]) => (
          <section key={workstream} className="overflow-hidden rounded-[28px] border border-black/[0.055] bg-white">
            <div className="flex items-center gap-3 border-b border-black/[0.055] bg-[#f5f2ea] px-6 py-5"><GitBranch size={17} className="text-[#9a7b31]"/><h2 className="text-lg font-black text-[#23324a]">{workstream}</h2><span className="ml-auto text-xs font-bold text-[#8a93a2]">{items.length} items</span></div>
            <div className="divide-y divide-black/[0.055]">
              {items.map((task:any, i:number) => (
                <article key={task.id || `${workstream}-${i}`} className="p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-base font-black text-[#23324a]">{task.title}</p><p className="mt-2 max-w-3xl text-sm leading-6 text-[#707b8c]">{task.description || task.definition_of_done}</p></div>{task.critical_path && <span className="shrink-0 rounded-full bg-[#f4ecd6] px-3 py-1 text-[10px] font-black text-[#80631f]">Critical path</span>}</div>
                  <div className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4"><div className="metric"><b>Owner</b><p className="mt-1">{task.who || 'Event team'}</p></div><div className="metric"><b>Target</b><p className="mt-1">{task.target_date || (task.weeks_before_event != null ? `${task.weeks_before_event}w before event` : 'Sequence-driven')}</p></div><div className="metric"><b>Depends on</b><p className="mt-1">{Array.isArray(task.depends_on) && task.depends_on.length ? task.depends_on.join(', ') : 'No hard dependency'}</p></div><div className="metric"><b>Done when</b><p className="mt-1">{task.completion_criteria || task.definition_of_done}</p></div></div>
                  {tier === 'professional' && (task.approval_required || task.risk_level || task.contingency) && <div className="mt-4 rounded-2xl border border-[#eadfbd] bg-[#fbf7ea] p-4 text-xs leading-5 text-[#725d2d]"><div className="flex gap-2"><ShieldAlert size={15} className="mt-0.5 shrink-0"/><div>{task.approval_required && <p><b>Approval:</b> {task.approver || 'Required approver'}</p>}{task.risk_level && <p><b>Risk:</b> {task.risk_level} — {task.risk_if_missed || 'Review impact before execution.'}</p>}{task.contingency && <p><b>Contingency:</b> {task.contingency}</p>}{task.vendor_scope && <p><b>Vendor scope:</b> {task.vendor_scope}</p>}</div></div></div>}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
