export default function PricingPage() {
  return (
    <main className="bg-white">

      {/* Header */}
      <div className="bg-[#f5f0e8] py-16 px-6 text-center">
        <p className="text-xs font-bold tracking-widest text-gold uppercase mb-4">Pricing</p>
        <h1 className="text-4xl font-bold text-navy mb-4">Pay once. Use it. Done.</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          No subscriptions. No monthly fees. Pay for what you need, when you need it. Start free, always.
        </p>
      </div>

      {/* Tiers */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-6">

          {/* FREE */}
          <div className="rounded-2xl border-2 border-gray-100 p-8">
            <div className="text-3xl mb-4">🆓</div>
            <div className="font-bold text-navy text-xl mb-1">Free</div>
            <div className="text-4xl font-bold text-navy mb-1">$0</div>
            <div className="text-sm text-gray-400 mb-6">Always free</div>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              {[
                'Browse all 400+ blueprints',
                'See every task in full',
                'Email required to unlock',
                'Share link with Dengine watermark',
                'All 24 categories',
              ].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {f}
                </li>
              ))}
            </ul>
            <a href="/browse"
              className="block text-center border-2 border-navy text-navy font-bold py-3 rounded-xl hover:bg-navy hover:text-white transition-all">
              Browse free →
            </a>
          </div>

          {/* PERSONAL */}
          <div className="rounded-2xl border-2 border-gray-100 p-8">
            <div className="text-3xl mb-4">🎉</div>
            <div className="font-bold text-navy text-xl mb-1">Personal</div>
            <div className="text-4xl font-bold text-navy mb-1">$9.99</div>
            <div className="text-sm text-gray-400 mb-6">One-time per event</div>
            <p className="text-xs text-gray-400 italic mb-4">
              Weddings, parties, birthdays, school events, community fairs, charity runs
            </p>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              {[
                'Everything in Free',
                'Customise any task, owner or timing',
                'Save your version permanently',
                'Share link without watermark',
                'Print-ready view',
              ].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {f}
                </li>
              ))}
            </ul>
            <a href="/custom"
              className="block text-center bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy/90 transition-all">
              Get Personal →
            </a>
          </div>

          {/* COMMUNITY */}
          <div className="rounded-2xl border-2 border-gray-100 p-8">
            <div className="text-3xl mb-4">🤝</div>
            <div className="font-bold text-navy text-xl mb-1">Community</div>
            <div className="text-4xl font-bold text-navy mb-1">$15</div>
            <div className="text-sm text-gray-400 mb-6">One-time per event</div>
            <p className="text-xs text-gray-400 italic mb-4">
              Charity events, community fetes, fundraising walks, volunteer days, religious events, cultural celebrations
            </p>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              {[
                'Everything in Personal',
                'Volunteer task claiming by name',
                'Shareable claiming link',
                'Task ownership tracking',
                'Print-ready task list',
              ].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {f}
                </li>
              ))}
            </ul>
            <a href="/custom"
              className="block text-center bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy/90 transition-all">
              Get Community →
            </a>
          </div>

          {/* PROFESSIONAL */}
          <div className="rounded-2xl border-2 border-gold p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
              Best for teams
            </div>
            <div className="text-3xl mb-4">💼</div>
            <div className="font-bold text-navy text-xl mb-1">Professional</div>
            <div className="text-4xl font-bold text-navy mb-1">$59</div>
            <div className="text-sm text-gray-400 mb-6">One-time per event</div>
            <p className="text-xs text-gray-400 italic mb-4">
              Corporate events, conferences, galas, product launches, trade shows, award ceremonies
            </p>
            <ul className="space-y-3 text-sm text-gray-600 mb-8">
              {[
                'Everything in Personal',
                'Gantt timeline view',
                'Sub-project breakdown',
                'Event date & backwards planning',
                'PDF export',
                'Location & spend context',
                'Multiple organisers',
              ].map(f => (
                <li key={f} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {f}
                </li>
              ))}
            </ul>
            <a href="/custom"
              className="block text-center bg-gold text-navy font-bold py-3 rounded-xl hover:bg-yellow-300 transition-all">
              Get Professional →
            </a>
          </div>

        </div>

        {/* Enterprise */}
        <div className="mt-8 text-center p-6 bg-[#f5f0e8] rounded-2xl">
          <p className="text-navy font-semibold mb-1">
            Running events at scale? Planning across a district, council or agency?
          </p>
          <p className="text-gray-500 text-sm mb-3">
            We work with organisations that run 10+ events a year. Volume pricing and white-label options available.
          </p>
          <a href="mailto:hello@dengine.app" className="text-gold font-semibold hover:underline text-sm">Talk to us →</a>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-8 text-center">Common questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Is the free tier genuinely useful?',
                a: 'Yes. You can browse every blueprint, read every task in full, and share a link with your team — all for free. The email gate unlocks the complete view. No credit card, no trial period.',
              },
              {
                q: 'What is the difference between Personal and Professional?',
                a: 'Personal ($9.99) covers individual personal events — weddings, parties, birthdays. Community ($15) adds volunteer task claiming and sharing tools for charity and civic events. Professional ($59) adds the full toolkit: Gantt timeline, sub-project breakdown, PDF export and backwards date planning for corporate and large-scale events.',
              },
              {
                q: 'What does "one-time per event" mean exactly?',
                a: 'You pay once for a specific event blueprint. You can return to it, edit it and share it as many times as you like. If you plan a second event, you pay again. There is no subscription.',
              },
              {
                q: 'Which tier applies to my event?',
                a: 'Personal covers personal, community and school events. Professional covers corporate, conference, fundraising gala, government and large-scale events. If you are unsure, start with the free browse — the checkout will suggest the right tier.',
              },
              {
                q: 'Can I upgrade from Personal to Professional later?',
                a: 'Yes. Pay the difference ($49) at any point and your blueprint upgrades instantly.',
              },
              {
                q: 'What is the Dengine watermark?',
                a: 'Free shared blueprints include a small "Planned with Dengine" footer on the share link. Personal and Professional remove it entirely.',
              },
            ].map(faq => (
              <div key={faq.q} className="border-b border-gray-100 pb-6">
                <h3 className="font-bold text-navy mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
