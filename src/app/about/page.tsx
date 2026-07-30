import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '서비스 소개',
  description: 'InvestBoard와 마케팅맵이 어떤 문제를 해결하고 어떤 원칙으로 운영되는지 소개합니다.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <header className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-accent">ABOUT INVESTBOARD</p>
        <h1 className="mt-2 text-3xl font-bold">근거 있는 정보와 통제 가능한 실행</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-text-secondary">
          InvestBoard는 금융 이슈를 이해하고 토론하는 InvestingBoard와, 작은 사업의 홍보 경로와
          영상 초안을 설계하는 마케팅맵을 함께 운영합니다. 두 제품의 목적과 책임은 구분하고,
          사용자가 필요한 순간에만 연결합니다.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold text-accent">INVESTINGBOARD</p>
          <h2 className="mt-2 text-xl font-bold">오늘 내 돈에 영향을 줄 변수를 이해합니다.</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            뉴스 제목을 복제하는 대신 출처, 검색 관심, 사이트 반응과 시장지표를 분리해 보여주고
            계산·체크리스트가 있는 원본 설명으로 연결합니다.
          </p>
          <Link href="/briefing" className="mt-4 inline-block text-sm text-accent-blue">오늘의 브리핑 →</Link>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs font-semibold text-accent">MARKETING MAP</p>
          <h2 className="mt-2 text-xl font-bold">홍보 아이디어를 이번 주 행동으로 바꿉니다.</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            URL·상품·매장·앱·소개글을 바탕으로 채널, 비용, 준비시간과 영상 장면을 정리합니다.
            외부 게시와 광고 집행은 사용자의 최종 승인 없이 실행하지 않습니다.
          </p>
          <Link href="/promotion-map" className="mt-4 inline-block text-sm text-accent-blue">실행지도 만들기 →</Link>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold">수익화 원칙</h2>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-text-secondary">
          <li>• 반복 방문할 가치와 원본 콘텐츠를 먼저 만들고 광고는 그 다음에 검토합니다.</li>
          <li>• 제휴·협찬이 들어가면 경제적 이해관계를 눈에 띄게 표시합니다.</li>
          <li>• 유료 투자 추천, 수익 보장, 광고 클릭 유도, 가짜 참여는 하지 않습니다.</li>
          <li>• 마케팅맵은 무료 계획과 미리보기로 수요를 검증한 뒤 고해상도 결과물의 유료화를 검토합니다.</li>
        </ul>
      </section>

      <section className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-sm leading-7 text-text-secondary">
        <h2 className="text-lg font-bold text-text-primary">현재 단계</h2>
        <p className="mt-2">
          베타 운영 중이며 기능 개수보다 실제 유효 방문, 재방문, 제작시간, 결과물 품질과 비용을 측정합니다.
          금융 정보는 일반적인 교육·정보 목적이며 개인별 투자 자문이 아닙니다.
        </p>
      </section>
    </article>
  );
}
