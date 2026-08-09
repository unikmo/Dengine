import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dengine.vercel.app'
  const now = new Date()

  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/custom`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${siteUrl}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/browse`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
