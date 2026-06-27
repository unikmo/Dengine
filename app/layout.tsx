import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Event Engine — Plan Any Event in Minutes',
  description: '354+ event blueprints. Smart intake questions. Volunteer task claiming. From PTA meetings to city marathons.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream min-h-screen`}>
        <nav className="bg-navy text-white px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="bg-gold rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-navy font-bold text-sm">EE</span>
            </div>
            <span className="font-bold text-lg">Event Engine™</span>
          </a>
          <div className="flex items-center gap-6 text-sm">
            <a href="/browse" className="hover:text-gold transition-colors">Browse Events</a>
            <a href="/custom" className="hover:text-gold transition-colors">Custom Event</a>
            <a href="/about" className="bg-gold text-navy px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
              How It Works
            </a>
          </div>
        </nav>
        {children}
        <footer className="bg-navy text-white/60 text-center py-8 text-sm mt-16">
          <p>Event Engine™ — Part of the Hero Tax ecosystem</p>
          <p className="mt-1">354+ event blueprints · 1,385 pre-built tasks · Volunteer-first design</p>
        </footer>
      </body>
    </html>
  )
}
