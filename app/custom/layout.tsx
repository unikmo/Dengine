import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Build an Event Execution Plan',
  description:
    'Create a dependency-aware event execution plan with workstreams, owners, backward deadlines, approvals, risks and completion criteria.',
  alternates: { canonical: '/custom' },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CustomLayout({ children }: { children: React.ReactNode }) {
  return children
}
