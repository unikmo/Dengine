import type { MetadataRoute } from 'next'
import { SEO_ACQUISITION_PAGES } from '@/lib/seo-acquisition'

export default function sitemap():MetadataRoute.Sitemap {
  const base=process.env.NEXT_PUBLIC_SITE_URL||'https://runyourevent.com'
  const core=['','/event-types','/agencies','/venues','/templates','/browse','/resources','/custom','/pricing','/about','/contact','/imprint','/privacy','/terms','/my-events']
  const acquisition=SEO_ACQUISITION_PAGES.map(page=>`/${page.slug}`)
  return [...core,...acquisition].map((path,i)=>({
    url:`${base}${path}`,
    lastModified:new Date(),
    changeFrequency:path===''?'weekly' as const:'monthly' as const,
    priority:path===''?1:path==='/custom'?0.95:path==='/company-event-planning'?0.92:['/event-planning-checklist','/event-planning-template','/wedding-planning-checklist','/family-reunion-planning'].includes(path)?0.86:0.72,
  }))
}
