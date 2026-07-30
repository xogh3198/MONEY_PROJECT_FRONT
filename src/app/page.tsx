import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="hub-root">
      <header className="hub-header">
        <Link className="hub-brand" href="/" aria-label="InvestBoard 홈">
          <span className="hub-brand-mark" aria-hidden="true">I</span>
          <span>
            <strong>InvestBoard</strong>
            <small>READ · DISCUSS · GROW</small>
          </span>
        </Link>
        <nav className="hub-nav" aria-label="제품 메뉴">
          <Link className="is-active" href="/">홈</Link>
          <Link href="/forum?utm_source=investboard-home-nav&utm_medium=internal&utm_campaign=product-navigation">
            InvestingBoard
          </Link>
          <Link href="/promotion-map?utm_source=investboard-home-nav&utm_medium=internal&utm_campaign=product-navigation">
            마케팅맵
          </Link>
        </nav>
        <span className="hub-status"><i aria-hidden="true" /> BETA</span>
      </header>

      <section className="hub-hero">
        <div className="hub-hero-copy">
          <p className="hub-kicker">ONE BOARD, TWO WAYS FORWARD</p>
          <h1>정보를 읽고,<br /><em>다음 행동</em>을 설계합니다.</h1>
          <p className="hub-lead">
            InvestBoard는 금융 이슈를 이해하고 토론하는 공간과, 내 서비스의 홍보 경로와
            영상을 설계하는 도구를 한곳에 연결합니다.
          </p>
          <div className="hub-actions">
            <Link
              className="hub-button hub-button-primary"
              href="/forum?utm_source=investboard-home-hero&utm_medium=internal&utm_campaign=product-navigation"
            >
              금융 뉴스 보기 <span aria-hidden="true">↗</span>
            </Link>
            <Link
              className="hub-button hub-button-secondary"
              href="/promotion-map?utm_source=investboard-home-hero&utm_medium=internal&utm_campaign=product-navigation"
            >
              홍보 계획 만들기 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="hub-signal-board" aria-label="InvestBoard의 세 단계">
          <div className="hub-signal-head">
            <span><i aria-hidden="true" /> TODAY&apos;S FLOW</span>
            <small>INVESTBOARD.CLOUD</small>
          </div>
          <ol>
            <li><span>01</span><div><small>READ</small><strong>근거를 확인하고</strong></div><b>뉴스·데이터</b></li>
            <li><span>02</span><div><small>DISCUSS</small><strong>관점을 나누고</strong></div><b>포럼·반응</b></li>
            <li><span>03</span><div><small>GROW</small><strong>실행을 설계합니다</strong></div><b>계획·영상</b></li>
          </ol>
          <p>서로 다른 목적은 섞지 않고, 필요한 순간에만 연결합니다.</p>
        </div>
      </section>

      <section className="hub-products" aria-labelledby="hub-products-title">
        <div className="hub-section-heading">
          <div>
            <p className="hub-kicker">CHOOSE YOUR BOARD</p>
            <h2 id="hub-products-title">오늘 필요한 곳으로 바로.</h2>
          </div>
          <p>
            세 메뉴는 모든 화면에서 유지됩니다. 홈에서 방향을 고르고, 각 제품에서는
            핵심 과업에 집중하세요.
          </p>
        </div>

        <div className="hub-product-grid">
          <article className="hub-product-card hub-product-forum">
            <div className="hub-product-number">01</div>
            <p className="hub-product-label">FINANCIAL INFORMATION &amp; FORUM</p>
            <h3>InvestingBoard</h3>
            <p className="hub-product-copy">
              공개 출처와 관심 신호를 바탕으로 중요한 금융 뉴스를 정리하고,
              사람들의 반응과 의견을 함께 확인합니다.
            </p>
            <ul>
              <li><span>NEWS</span> 인기·실시간 경제 뉴스</li>
              <li><span>SIGNAL</span> 검색 관심과 사이트 반응</li>
              <li><span>FORUM</span> 주제별 커뮤니티 토론</li>
            </ul>
            <Link href="/forum?utm_source=investboard-home-card&utm_medium=internal&utm_campaign=product-navigation">
              InvestingBoard 들어가기 <span aria-hidden="true">↗</span>
            </Link>
          </article>

          <article className="hub-product-card hub-product-map">
            <div className="hub-product-number">02</div>
            <p className="hub-product-label">PROMOTION PLAN &amp; VIDEO</p>
            <h3>마케팅맵</h3>
            <p className="hub-product-copy">
              URL·상품·매장·앱·소개글을 바탕으로 채널, 비용, 이번 주 행동을 정리하고
              검수 가능한 홍보 영상 초안까지 연결합니다.
            </p>
            <ul>
              <li><span>PLAN</span> 근거가 보이는 실행지도</li>
              <li><span>COST</span> 예산·제작시간 시나리오</li>
              <li><span>VIDEO</span> 대본·장면·MP4 미리보기</li>
            </ul>
            <div className="hub-card-actions">
              <Link href="/promotion-map?utm_source=investboard-home-card&utm_medium=internal&utm_campaign=product-navigation">
                마케팅맵 시작 <span aria-hidden="true">↗</span>
              </Link>
              <Link
                className="hub-studio-link"
                href="/promotion-map/studio?utm_source=investboard-home-card&utm_medium=internal&utm_campaign=marketing-map-video"
              >
                영상 스튜디오
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="hub-route-guide" aria-labelledby="route-guide-title">
        <p className="hub-kicker">THREE ENTRY POINTS</p>
        <h2 id="route-guide-title">어디서 들어와도 길을 잃지 않게.</h2>
        <div>
          <article><span>HOME</span><h3>InvestBoard 홈</h3><p>두 제품의 차이를 이해하고 목적지를 고릅니다.</p></article>
          <article><span>INFORMATION</span><h3>InvestingBoard</h3><p>금융 뉴스와 토론에 집중하고 필요할 때 홈으로 돌아옵니다.</p></article>
          <article><span>EXECUTION</span><h3>마케팅맵</h3><p>홍보 계획을 만든 뒤 같은 흐름에서 영상 제작으로 이동합니다.</p></article>
        </div>
      </section>

      <footer className="hub-footer">
        <div><strong>InvestBoard</strong><p>근거 있는 정보와 통제 가능한 실행을 연결합니다.</p></div>
        <p>금융 정보는 일반적인 교육·정보 목적이며 개인별 투자 자문이 아닙니다.</p>
      </footer>
    </main>
  );
}
