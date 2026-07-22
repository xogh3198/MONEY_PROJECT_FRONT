import type { Metadata } from 'next';
import Link from 'next/link';
import GrowthTracker from '@/components/analytics/GrowthTracker';
import { GUIDES } from '@/lib/guides';

export const metadata: Metadata = {
  title: '금융 데이터 가이드',
  description: '환율, 금리, 배당, 뉴스 관심지표를 숫자와 체크리스트로 이해하는 InvestBoard 원본 가이드입니다.',
  alternates: { canonical: 'https://investboard.cloud/guides' },
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-7">
      <GrowthTracker contentType="guide_index" contentId="guides" />
      <header className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent">INVESTBOARD GUIDES</p>
        <h1 className="mt-2 text-3xl font-bold">숫자를 투자 지시가 아닌 이해 도구로</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary">속보를 반복하지 않고 환율·금리·배당·관심지표가 실제로 무엇을 뜻하는지 계산과 체크리스트로 설명합니다.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {GUIDES.map(guide => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group rounded-xl border border-border bg-card p-5 transition hover:border-accent/50">
            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <span className="rounded-full bg-accent/10 px-2.5 py-1 text-accent">{guide.category}</span>
              <span>약 {guide.readMinutes}분</span>
            </div>
            <h2 className="mt-4 text-lg font-bold leading-7 group-hover:text-accent">{guide.title}</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{guide.description}</p>
            <p className="mt-4 text-xs text-accent-blue">가이드 읽기 →</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
