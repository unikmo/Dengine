export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.055] bg-[#fbfaf7]/92 backdrop-blur-xl">
      <div className="shell flex h-[72px] items-center justify-between gap-5">
        <a href="/" className="group flex items-center gap-3" aria-label="RunYourEvent home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#15233f] text-[10px] font-black tracking-[-0.04em] text-[#d8b65b] transition-transform group-hover:-rotate-2">RYE</span>
          <span className="leading-none">
            <span className="block text-[16px] font-black tracking-[-0.035em] text-[#15233f]">RunYourEvent</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#8d96a5]">Event execution platform</span>
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[#637083] lg:flex" aria-label="Primary">
          <a href="/#product" className="transition-colors hover:text-[#15233f]">Product</a>
          <a href="/company-event-planning" className="transition-colors hover:text-[#15233f]">Company Events</a>
          <a href="/event-types" className="transition-colors hover:text-[#15233f]">Event Types</a>
          <a href="/templates" className="transition-colors hover:text-[#15233f]">Templates</a>
          <a href="/pricing" className="transition-colors hover:text-[#15233f]">Pricing</a>
          <a href="/resources" className="transition-colors hover:text-[#15233f]">Resources</a>
          <a href="/my-events" className="font-black text-[#9a7b31] transition-colors hover:text-[#15233f]">My Events</a>
        </nav>
        <div className="flex items-center gap-2"><a href="/my-events" className="rounded-xl px-3 py-2 text-xs font-black text-[#637083] lg:hidden">My Events</a><a href="/custom" className="btn-signal !px-4 sm:!px-5"><span className="hidden sm:inline">Build Plan</span><span className="sm:hidden">Build</span><span aria-hidden="true" className="ml-2">→</span></a></div>
      </div>
    </header>
  )
}
