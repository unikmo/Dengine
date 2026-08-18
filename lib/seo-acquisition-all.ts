import { SEO_ACQUISITION_PAGES as SEO_PHASE1_PAGES } from '@/lib/seo-acquisition'
import { SEO_PHASE2_PAGES } from '@/lib/seo-acquisition-phase2'
import { SEO_PHASE3_PAGES } from '@/lib/seo-acquisition-phase3'

export const SEO_ACQUISITION_PAGES=[...SEO_PHASE1_PAGES,...SEO_PHASE2_PAGES,...SEO_PHASE3_PAGES]
export const SEO_ACQUISITION_BY_SLUG=Object.fromEntries(SEO_ACQUISITION_PAGES.map(page=>[page.slug,page]))

const clusters:Record<string,string[]>={
  company:['company-event-planning','company-retreat-planning','offsite-event-planning','product-launch-event-planning','corporate-event-planning-checklist','small-business-event-planning','event-execution-plan'],
  generic:['event-planning-checklist','event-planning-template','event-planning-timeline','event-execution-plan','company-event-planning'],
  wedding:['wedding-planning-checklist','wedding-planning-timeline','destination-wedding-planning','event-planning-timeline'],
  reunion:['family-reunion-planning','family-reunion-checklist','class-reunion-planning','event-planning-checklist'],
  mission:['nonprofit-event-planning','volunteer-event-planning','charity-event-planning','fundraising-event-planning-checklist','church-event-planning','community-event-planning','sports-event-planning'],
  celebration:['birthday-party-planning-checklist','graduation-party-planning-checklist','event-planning-checklist','event-planning-timeline'],
}

const clusterFor=(slug:string)=>Object.values(clusters).find(items=>items.includes(slug))||clusters.generic

export function getRelatedSeoPages(slug:string){
  return clusterFor(slug)
    .filter(candidate=>candidate!==slug)
    .slice(0,4)
    .map(candidate=>SEO_ACQUISITION_BY_SLUG[candidate])
    .filter(Boolean)
    .map(page=>({title:page.eyebrow,href:`/${page.slug}`}))
}
