import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Event Planning Reference',
  description:
    'Review an event planning reference model, then build a tailored dependency-aware execution plan with DEngine.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function EventReferenceLayout({ children }: { children: React.ReactNode }) {
  return children
}
