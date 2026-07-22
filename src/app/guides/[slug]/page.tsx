import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import GrowthTracker from '@/components/analytics/GrowthTracker';
import ShareButton from '@/components/ShareButton';
import TrackedLink from '@/components/analytics/TrackedLink';
import { getGuide, GUIDES } from '@/lib/guides';

const SITE_URL = 'https://investboard.cloud';

export function generateStaticParams() {
  return GUIDES.map(guide => ({ slug: guide.slug }));
}

type PageParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return { title: '가이드를 찾을 수 없습니다' };
  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    alternates: { canonical: url },
    openGraph: { title: guide.title, description: guide.description, url, type: 'article' },
  };
}

export default async function GuidePage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const url = `${SITE_URL}/guides/${guide.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    mainEntityOfPage: url,
    author: { '@type': 'Organization', name: 'InvestBoard 편집팀', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'InvestBoard', url: SITE_URL },
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: '금융 가이드', item: `${SITE_URL}/guides` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: url },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl">
      <GrowthTracker contentType="guide" contentId={guide.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />

      <nav className="mb-5 text-xs text-text-secondary"><Link href="/guides" className="hover:text-text-primary">금융 가이드</Link> / {guide.category}</nav>
      <header className="border-b border-border pb-7">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">{guide.category}</span>
          <ShareButton title={guide.title} path={`/guides/${guide.slug}`} contentType="guide" />
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">{guide.title}</h1>
        <p className="mt-4 text-base leading-8 text-text-secondary">{guide.description}</p>
        <div className="mt-4 flex gap-3 text-[11px] text-text-secondary"><span>InvestBoard 편집팀</span><span>·</span><time>{guide.updatedAt}</time><span>·</span><span>약 {guide.readMinutes}분</span></div>
      </header>

      <div className="space-y-10 py-8">
        {guide.sections.map(section => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold">{section.heading}</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-8 text-text-secondary">
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.formula && <div className="mt-5 rounded-lg border border-accent/25 bg-accent/5 p-4 text-center text-sm font-semibold text-text-primary">{section.formula}</div>}
            {section.example && <div className="mt-4 rounded-lg border border-border bg-card p-4 text-sm leading-7 text-text-secondary"><strong className="text-accent">예시</strong><p className="mt-2">{section.example}</p></div>}
            {section.bullets && <ul className="mt-5 space-y-2 rounded-lg border border-border bg-card p-5 text-sm leading-7 text-text-secondary">{section.bullets.map(item => <li key={item}>✓ {item}</li>)}</ul>}
          </section>
        ))}
      </div>

      <aside className="rounded-xl border border-accent/25 bg-accent/5 p-5">
        <h2 className="font-bold">읽은 내용을 실제 데이터로 확인해보세요</h2>
        <p className="mt-2 text-sm text-text-secondary">계산 결과는 가정을 확인하는 도구이며 미래 수익을 보장하지 않습니다.</p>
        <TrackedLink
          href={guide.relatedHref}
          eventName="guide_next_action"
          properties={{ guide: guide.slug }}
          className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black"
        >
          {guide.relatedLabel} →
        </TrackedLink>
      </aside>

      <p className="mt-8 text-center text-[11px] leading-5 text-text-secondary">본 콘텐츠는 교육·정보 제공 목적이며 개인별 투자 조언이 아닙니다. 세금·상품 조건은 변경될 수 있으므로 공식 자료를 함께 확인하세요.</p>
    </article>
  );
}
