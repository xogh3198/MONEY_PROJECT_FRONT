import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '편집·AI 콘텐츠 정책',
  description: 'InvestBoard의 출처, 사실 검증, AI 사용, 정정과 상업적 이해관계 표시 원칙입니다.',
  alternates: { canonical: '/editorial-policy' },
};

export default function EditorialPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-accent">EDITORIAL POLICY</p>
        <h1 className="mt-2 text-3xl font-bold">편집·AI 콘텐츠 정책</h1>
        <p className="mt-3 text-sm text-text-secondary">마지막 검토: 2026년 7월 30일</p>
      </header>

      <Policy title="1. 원문과 자체 설명을 구분합니다">
        뉴스 제목·요약에는 매체와 원문 링크를 표시합니다. InvestBoard가 덧붙인 시장 영향,
        계산, 체크리스트와 해석은 원문 사실과 혼동되지 않게 별도 영역에 표시합니다.
      </Policy>
      <Policy title="2. 수치를 추정해 사실처럼 쓰지 않습니다">
        공식 API나 공개 구조화 데이터에 없는 조회·댓글·반응 수치는 임의로 만들지 않습니다.
        네이버 DataLab 값은 실제 기사 조회수가 아니라 상대 검색 관심 신호이며 산식과 한계를 공개합니다.
      </Policy>
      <Policy title="3. AI는 초안 도구이고 게시 책임을 대신하지 않습니다">
        AI는 대본과 장면 초안을 만들 수 있지만 출처, 수치, 표현, 이미지·음성 사용권을 사람이 확인하기
        전에는 공개하지 않습니다. 현실적인 합성 콘텐츠는 게시 플랫폼이 요구하는 방식으로 표시합니다.
      </Policy>
      <Policy title="4. 금융 정보의 경계를 지킵니다">
        일반적인 교육·정보와 계산을 제공하며 개인의 재산, 위험선호, 투자기간을 반영한 매수·매도 지시는
        제공하지 않습니다. 수익 보장, 과장된 긴급성, 손실 가능성 은폐를 금지합니다.
      </Policy>
      <Policy title="5. 광고와 제휴는 편집 판단과 분리합니다">
        광고주나 제휴사가 기사 순위와 결론을 구매할 수 없습니다. 경제적 대가가 있는 콘텐츠와 링크는
        사용자가 알아볼 수 있도록 표시하며 광고 클릭을 요청하지 않습니다.
      </Policy>
      <Policy title="6. 정정 이력을 남깁니다">
        중요한 사실이나 산식 오류가 확인되면 원문을 조용히 바꾸는 데 그치지 않고 수정일과 변경 내용을
        해당 페이지에 표시하는 방식으로 운영합니다. 베타 기간의 정정 요청 창구는 준비 중입니다.
      </Policy>

      <div className="rounded-xl border border-border bg-card p-5 text-sm leading-7 text-text-secondary">
        데이터 수집 기준과 인기 산식은 <Link href="/methodology" className="text-accent-blue">데이터·편집 원칙</Link>에서
        더 자세히 확인할 수 있습니다.
      </div>
    </article>
  );
}

function Policy({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{children}</p>
    </section>
  );
}
