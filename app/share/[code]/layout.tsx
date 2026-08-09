import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shared Event Execution Plan',
  description: 'A shared DEngine event execution plan.',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}

export default function SharedPlanLayout({ children }: { children: React.ReactNode }) {
  return children
}
