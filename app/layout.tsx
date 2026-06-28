import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dengine — Plan any event. Every task claimable.',
  description: 'Break any event into claimable tasks — weddings, galas, marathons, school fairs. Every task under 15 minutes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream min-h-screen`}>
        <nav className="bg-navy text-white px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="bg-gold rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-navy font-bold text-sm">D</span>
            </div>
            <span className="font-bold text-lg">Dengine</span>
          </a>
          <div className="flex items-center gap-6 text-sm">
            <a href="/browse" className="hover:text-gold transition-colors">Browse</a>
            <a href="/custom" className="hover:text-gold transition-colors">Plan an event</a>
            <a href="/about" className="hover:text-gold transition-colors">How it works</a>
            <a href="/pricing" className="hover:text-gold transition-colors">Pricing</a>
          </div>
        </nav>
        {children}
        <footer className="bg-navy text-white/50 text-center py-8 text-sm mt-16">
          <p>Dengine — Plan any event. Every task claimable.</p>
        </footer>
      </body>
    </html>
  )
}
