import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Event Planning Reference Library',
  description:
    'Browse event planning reference models and categories, then turn your event date and context into a tailored execution plan with DEngine.',
  alternates: { canonical: '/browse' },
}

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return children
}
