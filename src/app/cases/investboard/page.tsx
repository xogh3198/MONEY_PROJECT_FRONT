import Link from 'next/link';

export default function InvestBoardCasePage() {
  return (
    <main className="promotion-root case-page">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="홍보지도 홈">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span className="brand-copy">
            <strong>홍보지도</strong>
            <small>PROMOTION MAP</small>
          </span>
        </Link>
        <nav aria-label="주요 메뉴">
          <Link href="/?utm_source=investboard-case&utm_medium=internal&utm_campaign=product-bridge#planner">
            실행지도
          </Link>
          <a href="#flow">운영 흐름</a>
          <Link href="/forum?utm_source=investboard-case-nav&utm_medium=internal&utm_campaign=product-bridge">
            InvestingBoard
          </Link>
        </nav>
        <span className="pilot-badge">
          <i aria-hidden="true" />
          OPERATING CASE
        </span>
      </header>

      <section className="case-hero">
        <div>
          <p className="eyebrow">
            <span aria-hidden="true">01</span>
            홍보지도 실제 운영 사례
          </p>
          <h1>
            뉴스를 모으는 것에서 끝내지 않고,
            <br />
            <em>사람이 들어올 이유</em>를 만듭니다.
          </h1>
          <p>
            InvestingBoard는 금융 뉴스·토론 서비스이면서 홍보지도의 첫 번째 운영 사례입니다.
            공개 관심 신호로 주제를 발견하고, 사이트에서 맥락을 제공한 뒤, 검수한 짧은 영상으로
            다시 유입을 만드는 흐름을 시험합니다.
          </p>
          <div className="case-actions">
            <Link
              className="hero-primary"
              href="/forum?utm_source=investboard-case-hero&utm_medium=internal&utm_campaign=product-bridge"
            >
              InvestingBoard 보기 <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className="hero-secondary"
              href="/?utm_source=investboard-case-hero&utm_medium=internal&utm_campaign=product-bridge#planner"
            >
              내 홍보지도 만들기 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="case-summary-card" aria-label="두 제품의 역할">
          <div>
            <small>PRODUCT</small>
            <strong>홍보지도</strong>
            <p>홍보 대상 입력 → 채널·비용·행동 → 검수형 영상 초안</p>
          </div>
          <span aria-hidden="true">×</span>
          <div>
            <small>OPERATING CASE</small>
            <strong>InvestBoard</strong>
            <p>금융 관심 신호 → 뉴스·토론 → 콘텐츠 유입 검증</p>
          </div>
        </div>
      </section>

      <section className="case-flow-section" id="flow" aria-labelledby="case-flow-title">
        <div className="case-section-heading">
          <div>
            <p className="section-kicker">FROM SIGNAL TO RETURN VISIT</p>
            <h2 id="case-flow-title">실제로 연결되는 네 단계</h2>
          </div>
          <p>
            기사 복제나 자동 게시가 목적이 아닙니다. 신호를 발견하고 고유한 설명을 더한 뒤,
            어떤 경로가 유효 방문과 재방문을 만드는지 확인합니다.
          </p>
        </div>
        <ol className="case-flow">
          <li>
            <span>01</span>
            <small>DISCOVER</small>
            <h3>관심 신호 발견</h3>
            <p>최신 뉴스, 공개 검색 관심도와 사이트 반응을 분리해 확인합니다.</p>
          </li>
          <li>
            <span>02</span>
            <small>EXPLAIN</small>
            <h3>맥락 있는 주제 선택</h3>
            <p>단순 제목 낭독이 아니라 숫자·영향·확인할 지표를 붙일 주제를 고릅니다.</p>
          </li>
          <li>
            <span>03</span>
            <small>PUBLISH</small>
            <h3>포럼에서 깊이 확인</h3>
            <p>사용자는 뉴스 출처와 반응을 확인하고 관련 토론으로 이어갈 수 있습니다.</p>
          </li>
          <li>
            <span>04</span>
            <small>LEARN</small>
            <h3>영상과 유입을 검증</h3>
            <p>사람이 검수한 영상 초안과 UTM으로 게시 가치와 사이트 이동을 측정합니다.</p>
          </li>
        </ol>
      </section>

      <section className="case-boundary" aria-labelledby="boundary-title">
        <div>
          <p className="section-kicker">CLEAR BOUNDARY</p>
          <h2 id="boundary-title">같이 운영하지만, 같은 제품처럼 섞지 않습니다.</h2>
        </div>
        <div className="case-boundary-grid">
          <article>
            <span>홍보가 필요한 사용자</span>
            <h3>홍보지도에서 시작</h3>
            <p>사업·상품·매장·앱·콘텐츠를 입력하고 실행할 채널과 영상 초안을 만듭니다.</p>
            <Link href="/?utm_source=investboard-case-boundary&utm_medium=internal&utm_campaign=product-bridge#planner">
              무료 실행지도 만들기 →
            </Link>
          </article>
          <article>
            <span>금융 정보를 찾는 사용자</span>
            <h3>InvestingBoard에서 시작</h3>
            <p>금융 뉴스와 공개 관심 신호를 확인하고 사용자 반응과 토론을 살펴봅니다.</p>
            <Link href="/forum?utm_source=investboard-case-boundary&utm_medium=internal&utm_campaign=product-bridge">
              금융 뉴스 보기 →
            </Link>
          </article>
        </div>
      </section>

      <section className="case-cta">
        <p className="section-kicker">YOUR NEXT MOVE</p>
        <h2>당신의 서비스도<br />실행 가능한 홍보 경로로.</h2>
        <p>URL이 없어도 소개글 하나로 시작할 수 있습니다. 자동 게시나 광고 집행 없이 계획부터 확인하세요.</p>
        <Link
          className="hero-primary"
          href="/?utm_source=investboard-case-cta&utm_medium=internal&utm_campaign=product-bridge#planner"
        >
          내 홍보 계획 시작 <span aria-hidden="true">↗</span>
        </Link>
      </section>

      <footer>
        <div>
          <strong>홍보지도 <span>↗</span></strong>
          <p>다른 고객, 하나의 투명한 콘텐츠 운영 흐름.</p>
        </div>
        <div className="footer-status">
          <i aria-hidden="true" />
          운영 사례 · 자동 게시 및 광고 집행 없음
        </div>
      </footer>
    </main>
  );
}
