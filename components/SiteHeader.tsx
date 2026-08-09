export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.055] bg-[#fbfaf7]/90 backdrop-blur-xl">
      <div className="shell flex h-[72px] items-center justify-between gap-5">
        <a href="/" className="group flex items-center gap-3" aria-label="DEngine home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#15233f] text-[12px] font-black tracking-[-0.04em] text-[#d8b65b] transition-transform group-hover:-rotate-2">
            DE
          </span>
          <span className="leading-none">
            <span className="block text-[16px] font-black tracking-[-0.035em] text-[#15233f]">DEngine</span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.16em] text-[#8d96a5]">
              Event execution intelligence
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#637083] md:flex" aria-label="Primary">
          <a href="/#product" className="transition-colors hover:text-[#15233f]">Product</a>
          <a href="/#use-cases" className="transition-colors hover:text-[#15233f]">Use cases</a>
          <a href="/browse" className="transition-colors hover:text-[#15233f]">Event library</a>
          <a href="/pricing" className="transition-colors hover:text-[#15233f]">Pricing</a>
        </nav>

        <a href="/custom" className="btn-signal !px-4 sm:!px-5">
          <span className="hidden sm:inline">Build my plan</span>
          <span className="sm:hidden">Build plan</span>
          <span aria-hidden="true" className="ml-2">→</span>
        </a>
      </div>
    </header>
  )
}
