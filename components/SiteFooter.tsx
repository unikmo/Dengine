export default function SiteFooter() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#f5f2ea]">
      <div className="shell py-12">
        <div className="grid gap-9 md:grid-cols-[1.3fr_.7fr_.7fr]">
          <div className="max-w-md">
            <div className="text-lg font-black tracking-[-0.035em] text-[#15233f]">DEngine</div>
            <p className="mt-3 text-sm leading-6 text-[#687386]">
              Event planning software that turns a fixed event date and operating brief into a dependency-aware execution plan.
            </p>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8c7440]">Product</p>
            <div className="mt-4 space-y-3 text-sm font-semibold text-[#657185]">
              <a className="block hover:text-[#15233f]" href="/custom">Build a plan</a>
              <a className="block hover:text-[#15233f]" href="/browse">Event library</a>
              <a className="block hover:text-[#15233f]" href="/pricing">Pricing</a>
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#8c7440]">Company</p>
            <div className="mt-4 space-y-3 text-sm font-semibold text-[#657185]">
              <a className="block hover:text-[#15233f]" href="/about">About</a>
              <a className="block hover:text-[#15233f]" href="mailto:hello@dengine.app">Contact</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-black/[0.07] pt-6 text-xs text-[#8a93a2] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DEngine. Event Execution Intelligence.</p>
          <p>Built for event teams that need operational clarity before task management.</p>
        </div>
      </div>
    </footer>
  )
}
