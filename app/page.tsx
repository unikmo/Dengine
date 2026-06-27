export default function HomePage() {
  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-widest text-gold uppercase mb-8">Dengine</p>
        <h1 className="text-5xl sm:text-6xl font-bold text-navy mb-5 leading-tight">
          Plan any event.<br />In minutes.
        </h1>
        <p className="text-gray-400 text-lg mb-16">
          266 event types. Every task decomposed. Anyone can help.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <a href="/browse" className="bg-navy text-white rounded-2xl p-8 text-left hover:bg-navy/90 transition-all group">
            <div className="text-4xl mb-5">**</div>
            <div className="font-bold text-xl mb-2">Ready blueprints</div>
            <div className="text-white/50 text-sm leading-relaxed">266 event types with tasks already built. Pick yours and go.</div>
            <div className="mt-8 text-gold text-sm font-semibold group-hover:underline">Browse events</div>
          </a>
          <a href="/custom" className="bg-gold text-navy rounded-2xl p-8 text-left hover:bg-yellow-300 transition-all group">
            <div className="text-4xl mb-5">*</div>
            <div className="font-bold text-xl mb-2">Break down my idea</div>
            <div className="text-navy/50 text-sm leading-relaxed">Describe any event - Dengine decomposes it into claimable tasks.</div>
            <div className="mt-8 text-navy text-sm font-semibold group-hover:underline">Build a blueprint</div>
          </a>
        </div>
      </div>
    </main>
  )
}