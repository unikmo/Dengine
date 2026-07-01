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
        <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
          <a href="/" className="flex items-center gap-2.5">
            <div className="bg-navy rounded-lg w-7 h-7 flex items-center justify-center">
              <span className="text-gold font-bold text-xs">D</span>
            </div>
            <span className="font-bold text-navy text-base">Dengine</span>
          </a>
          <div className="flex items-center gap-8 text-sm text-gray-500">
            <a href="/browse" className="hover:text-navy transition-colors">Explore the Library</a>
            <a href="/custom" className="hover:text-navy transition-colors">Create a Blueprint</a>
            <a href="/pricing" className="hover:text-navy transition-colors">Pricing</a>
            <a href="/browse" className="bg-gold text-navy font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors text-xs">
              Get started free
            </a>
          </div>
        </nav>
        {children}
        <footer className="border-t border-gray-100 text-center py-10 text-sm text-gray-400 mt-20">
          <p>Dengine — The world&apos;s largest event blueprint library.</p>
        </footer>
      </body>
    </html>
  )
}
