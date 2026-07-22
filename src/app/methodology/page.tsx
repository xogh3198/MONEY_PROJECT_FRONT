import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '데이터·편집 원칙',
  description: 'InvestBoard가 뉴스, 공개 관심 신호, 검색 관심도와 자체 반응을 수집하고 설명하는 기준입니다.',
  alternates: { canonical: '/methodology' },
};

const UPDATED_AT = '2026-07-22';

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Trust &amp; methodology</p>
        <h1 className="text-3xl font-bold text-text-primary">데이터·편집 원칙</h1>
        <p className="leading-7 text-text-secondary">
          외부 기사에 없는 숫자를 추정해 사실처럼 표시하지 않습니다. 각 수치의 출처와 의미를 구분하고, 원문 사실과 InvestBoard의 설명도 분리합니다.
        </p>
        <p className="text-xs text-text-secondary">마지막 검토: {UPDATED_AT}</p>
      </header>

      <section className="card p-6 space-y-3">
        <h2 className="text-xl font-semibold">표시하는 반응 수치</h2>
        <dl className="space-y-4 text-sm leading-6 text-text-secondary">
          <div>
            <dt className="font-semibold text-text-primary">외부 관심 신호</dt>
            <dd>원문이 공개한 구조화 데이터 또는 공식 API에서 확인된 조회·댓글·긍정·부정 반응입니다. 제공자가 공개하지 않으면 ‘미제공’으로 표시합니다.</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-primary">검색 관심도</dt>
            <dd>네이버 데이터랩에서 코스피·미국증시·환율·금리·암호자산 등 기사 카테고리별 키워드 그룹을 비교한 상대 지수(기간 내 최대값 100)입니다. 제목별 검색량이나 기사 자체 조회수가 아닙니다.</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-primary">InvestBoard 내부 반응</dt>
            <dd>이 사이트에서 발생한 조회·댓글·좋아요·싫어요입니다. 외부 플랫폼 수치와 합산하지 않습니다.</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">수집 기준</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-text-secondary">
          <li>공식 API를 우선하며, 키가 필요한 서비스는 키가 설정된 경우에만 요청합니다.</li>
          <li>일반 웹페이지는 robots.txt가 허용하고 공개 구조화 데이터가 있을 때만 제한적으로 읽습니다.</li>
          <li>로그인 우회, 비공개 내부 API, 접근 제한 회피, 댓글 본문 무단 복제는 하지 않습니다.</li>
          <li>네이버 뉴스 내부 댓글·반응은 공식 공개 API가 없고 robots 정책이 수집을 허용하지 않아 직접 가져오지 않습니다.</li>
          <li>실패·미지원·정책 차단 상태를 구분해 저장하며, 없는 값을 0으로 오인하게 만들지 않습니다.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">인기 순위와 브리핑</h2>
        <p className="text-sm leading-6 text-text-secondary">
          최신성, 자체 참여, 확인된 외부 관심 신호, 검색 관심도를 함께 사용합니다. 특정 플랫폼의 숫자 하나만으로 순위를 결정하지 않으며, 원문을 단순 복제하지 않고 시장 맥락·영향 경로·추가 확인 항목을 덧붙입니다.
        </p>
      </section>

      <section className="rounded-xl border border-accent/30 bg-accent/5 p-6 space-y-3">
        <h2 className="text-xl font-semibold">한계와 정정</h2>
        <p className="text-sm leading-6 text-text-secondary">
          외부 제공자가 숫자를 수정하거나 삭제하면 반영에 시간이 걸릴 수 있습니다. 자동 생성 초안은 공개 전 사실·권리 검토 대상이며, 현실적인 합성 미디어에는 플랫폼이 요구하는 표시를 적용합니다. 모든 콘텐츠는 일반 정보이며 수익을 보장하거나 매수·매도를 지시하지 않습니다.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/briefing" className="text-accent hover:underline">오늘의 브리핑 보기</Link>
          <Link href="/guides/news-engagement-metrics" className="text-accent hover:underline">반응 수치 읽는 법</Link>
        </div>
      </section>
    </article>
  );
}
