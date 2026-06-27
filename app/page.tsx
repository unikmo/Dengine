export default function HomePage() {
  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-gold uppercase mb-8">Dengine</p>
        <h1 className="text-5xl sm:text-6xl font-bold text-navy mb-6 leading-tight">
          Plan any event.<br />In minutes.
        </h1>
        <div className="bg-navy rounded-2xl px-8 py-5 mb-10 max-w-xl mx-auto">
          <p className="text-white/70 text-base leading-relaxed">
            Others give you a plan.{' '}
            <span className="text-white font-semibold">
              Dengine gives you claimable tasks — every one under 15 minutes, so anyone on your team can help.
            </span>
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <a href="/browse" className="bg-gold text-navy rounded-2xl p-8 text-left hover:bg-yellow-300 transition-all group">
            <div className="text-4xl mb-5">⚡</div>
            <div className="font-bold text-xl mb-2">Ready blueprints</div>
            <div className="text-navy/60 text-sm leading-relaxed">266 event types with tasks already built. Pick yours and go.</div>
            <div className="mt-8 text-navy text-sm font-bold group-hover:underline">Browse events →</div>
          </a>
          <a href="/custom" className="bg-white border-2 border-navy text-navy rounded-2xl p-8 text-left hover:bg-navy/5 transition-all group">
            <div className="text-4xl mb-5">✨</div>
            <div className="font-bold text-xl mb-2">Break down my idea</div>
            <div className="text-navy/60 text-sm leading-relaxed">Describe any event — Dengine decomposes it into claimable tasks instantly.</div>
            <div className="mt-8 text-navy text-sm font-bold group-hover:underline">Build a blueprint →</div>
          </a>
        </div>
      </div>
    </main>
  )
}

