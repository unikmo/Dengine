import type { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category: rawCategory } = await params
  const category = decodeURIComponent(rawCategory)

  return {
    title: `${category} Event Planning`,
    description:
      `Explore ${category} event planning reference models, then build a tailored dependency-aware execution plan with RunYourEvent.`,
    alternates: {
      canonical: `/browse/${encodeURIComponent(category)}`,
    },
  }
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children
}
