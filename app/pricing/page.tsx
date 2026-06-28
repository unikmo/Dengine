'use client'
import { useState } from 'react'

const FAQ = [
  {
    q: 'Can I use Dengine for free forever?',
    a: 'Yes. The free tier is genuinely useful — 3 blueprints a month, all event types. No credit card required.',
  },
  {
    q: 'What counts as a blueprint?',
    a: "Each time you generate a task plan for an event. Reloading a saved blueprint doesn't count.",
  },
  {
    q: 'What\'s the Dengine watermark?',
    a: "Free share links include a small 'Planned with Dengine' footer. Pro removes it.",
  },
]

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-navy mb-3">Simple pricing. Start free.</h1>
        <p className="text-gray-500">Upgrade when you need more. Downgrade anytime.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {/* Free */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Free</div>
            <div className="text-4xl font-bold text-navy mb-1">$0</div>
            <div className="text-xs text-gray-400">forever</div>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 flex-1 mb-8">
            {[
              '3 blueprints per month',
              'All 266 event types',
              'Layer view',
              'Share link (with Dengine watermark)',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
          <a
            href="/custom"
            className="block text-center bg-gray-100 text-navy py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Start free →
          </a>
        </div>

        {/* Pro */}
        <div className="bg-navy rounded-2xl p-8 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">
            Most popular
          </div>
          <div className="mb-6">
            <div className="text-sm font-semibold text-white/50 uppercase tracking-wide mb-2">Pro</div>
            <div className="text-4xl font-bold text-white mb-1">$12</div>
            <div className="text-xs text-white/40">per month · or $99/year (save 30%)</div>
          </div>
          <ul className="space-y-3 text-sm text-white/80 flex-1 mb-8">
            {[
              'Unlimited blueprints',
              'All 266 event types',
              'Layer, sub-project & timeline views',
              'Event date planning + backwards timeline',
              'Clean share links (no watermark)',
              'PDF export',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-gold mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
          <a
            href="/waitlist"
            className="block text-center bg-gold text-navy py-3 rounded-xl font-semibold text-sm hover:bg-yellow-300 transition-colors"
          >
            Get Pro →
          </a>
        </div>

        {/* Teams */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Teams</div>
            <div className="text-4xl font-bold text-navy mb-1">$39</div>
            <div className="text-xs text-gray-400">per month</div>
          </div>
          <ul className="space-y-3 text-sm text-gray-600 flex-1 mb-8">
            {[
              'Everything in Pro',
              'Up to 10 organisers',
              'Live task claiming dashboard',
              'Recurring event templates',
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
          <a
            href="mailto:hello@dengine.app"
            className="block text-center bg-gray-100 text-navy py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Talk to us →
          </a>
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mb-16">
        Need a district or enterprise plan? We work with schools, councils, and event agencies.{' '}
        <a href="mailto:hello@dengine.app" className="text-navy underline">Get in touch →</a>
      </p>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-navy mb-6">Questions</h2>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
              >
                <span className="font-medium text-gray-900 text-sm">{item.q}</span>
                <span className="text-gray-400 flex-shrink-0">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
