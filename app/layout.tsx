import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dengine.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DEngine — Event Planning & Execution Intelligence',
    template: '%s | DEngine',
  },
  description:
    'Event planning software for professional teams. Turn a fixed event date into workstreams, dependencies, owners, backward deadlines, approvals, risks and completion criteria.',
  applicationName: 'DEngine',
  category: 'Business Software',
  keywords: [
    'event planning software',
    'event management planning software',
    'event project plan',
    'event operations software',
    'conference planning software',
    'event timeline',
    'event execution plan',
    'event agency software',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'DEngine',
    title: 'DEngine — Event Planning & Execution Intelligence',
    description:
      'Build a dependency-aware event execution plan backwards from the fixed event date.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEngine — Event Planning & Execution Intelligence',
    description:
      'Build a dependency-aware event execution plan backwards from the fixed event date.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
