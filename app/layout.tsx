import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'DEngine — Event Execution Intelligence',
    template: '%s | DEngine',
  },
  description:
    'Turn an event brief and fixed date into workstreams, dependencies, owners, backward deadlines, approvals, risks and completion criteria.',
  keywords: [
    'event planning software',
    'event project plan',
    'event operations',
    'event timeline',
    'conference planning',
    'event agency software',
    'event execution plan',
  ],
  openGraph: {
    title: 'DEngine — Event Execution Intelligence',
    description:
      'Build the execution architecture for professional events: dependencies, backward deadlines, approvals, risks and readiness.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-cream min-h-screen text-gray-900`}>
        <nav className="bg-white/95 backdrop-blur border-b border-gray-100 px-5 sm:px-8 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <div className="bg-navy rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-gold font-bold text-xs">D</span>
              </div>
              <div>
                <span className="font-bold text-navy text-base block leading-none">DEngine</span>
                <span className="text-[9px] uppercase tracking-[0.16em] text-gray-400">Event Execution Intelligence</span>
              </div>
            </a>
            <div className="hidden md:flex items-center gap-7 text-sm text-gray-500">
              <a href="/#product" className="hover:text-navy transition-colors">Product</a>
              <a href="/browse" className="hover:text-navy transition-colors">Reference Library</a>
              <a href="/pricing" className="hover:text-navy transition-colors">Pricing</a>
              <a href="/custom" className="bg-gold text-navy font-bold px-4 py-2.5 rounded-lg hover:bg-yellow-300 transition-colors text-xs">
                Build an execution plan
              </a>
            </div>
            <a href="/custom" className="md:hidden bg-gold text-navy font-bold px-3.5 py-2 rounded-lg text-xs">
              Build plan
            </a>
          </div>
        </nav>
        {children}
        <footer className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row gap-4 items-center justify-between text-sm text-gray-400">
            <p>DEngine — Event Execution Intelligence.</p>
            <div className="flex gap-5">
              <a href="/browse" className="hover:text-navy">Reference Library</a>
              <a href="/pricing" className="hover:text-navy">Pricing</a>
              <a href="mailto:hello@dengine.app" className="hover:text-navy">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
