import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SeoAcquisitionPage from '@/components/SeoAcquisitionPage'
import { SEO_ACQUISITION_BY_SLUG, SEO_ACQUISITION_PAGES } from '@/lib/seo-acquisition'

export const dynamicParams=false

export function generateStaticParams(){return SEO_ACQUISITION_PAGES.map(page=>({seoSlug:page.slug}))}

export async function generateMetadata({params}:{params:Promise<{seoSlug:string}>}):Promise<Metadata>{
  const {seoSlug}=await params
  const page=SEO_ACQUISITION_BY_SLUG[seoSlug]
  if(!page) return {}
  return {
    title:page.metaTitle,
    description:page.metaDescription,
    alternates:{canonical:`/${page.slug}`},
    openGraph:{title:page.metaTitle,description:page.metaDescription,url:`/${page.slug}`,type:'website'},
  }
}

export default async function SeoLanding({params}:{params:Promise<{seoSlug:string}>}){
  const {seoSlug}=await params
  const page=SEO_ACQUISITION_BY_SLUG[seoSlug]
  if(!page) notFound()
  return <SeoAcquisitionPage eyebrow={page.eyebrow} title={page.title} lead={page.lead} intro={page.intro} workstreams={page.workstreams} steps={page.steps} outputs={page.outputs} pitfalls={page.pitfalls} cta={page.cta} faqs={page.faqs}/>
}
