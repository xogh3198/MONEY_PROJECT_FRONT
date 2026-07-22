import type { Metadata } from 'next';
import Link from 'next/link';
import EngagementMetrics from '@/components/news/EngagementMetrics';
import GrowthTracker from '@/components/analytics/GrowthTracker';
import ShareButton from '@/components/ShareButton';
import TrackedLink from '@/components/analytics/TrackedLink';
import { CATEGORY_LABELS, NewsArticle } from '@/lib/news';
import { rankNewsForBriefing } from '@/lib/news-ranking';

const SITE_URL = 'https://investboard.cloud';
const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.124.149.70:8083';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '오늘의 1분 머니 브리핑',
  description: '인기 금융 뉴스와 시장지표, 공개 관심 신호를 연결해 오늘 확인할 세 가지 변수를 설명합니다.',
  alternates: { canonical: `${SITE_URL}/briefing` },
  openGraph: {
    title: '오늘의 1분 머니 브리핑 | InvestBoard',
    description: '오늘 내 돈에 영향을 줄 시장 변수 3가지를 데이터와 함께 확인하세요.',
    url: `${SITE_URL}/briefing`,
    type: 'website',
  },
};

interface Indicator {
  type: string;
  name: string;
  value: number;
  changePercent: number;
  updatedAt?: string;
}

const GUIDANCE: Record<string, { why: string; affected: string; checks: string[]; indicators: string[] }> = {
  DOMESTIC: {
    why: '국내 증시 뉴스는 지수 방향보다 실적·수급·업종 확산 여부를 함께 봐야 영향의 지속성을 판단하기 쉽습니다.',
    affected: '국내 주식·ETF 보유자와 원화 자산 비중이 높은 사용자',
    checks: ['코스피와 코스닥이 같은 방향인지', '특정 종목이 아니라 업종 전반으로 움직임이 확산되는지', '다음 실적·정책 일정이 언제인지'],
    indicators: ['KOSPI', 'KOSDAQ'],
  },
  OVERSEAS: {
    why: '미국 시장 변화는 야간 선물, 환율, 국내 대형 수출주의 개장 흐름을 거쳐 국내 투자자에게 전달될 수 있습니다.',
    affected: '미국 주식·해외 ETF 보유자와 국내 수출주 투자자',
    checks: ['S&P 500 변화가 일부 대형주에만 집중됐는지', '원/달러 환율이 같은 방향으로 움직이는지', '다음 미국 경제지표 발표 시각'],
    indicators: ['SP500', 'USD_KRW'],
  },
  FOREX: {
    why: '환율은 해외자산의 원화 환산가치, 수입 비용, 여행·유학 비용에 서로 다른 방향으로 영향을 줄 수 있습니다.',
    affected: '해외주식 보유자, 달러 지출 예정자, 수입 비용에 민감한 업종',
    checks: ['자산 자체 수익률과 환율 효과를 분리했는지', '하루 움직임인지 추세 변화인지', '금리와 달러지수가 함께 움직이는지'],
    indicators: ['USD_KRW', 'SP500'],
  },
  RATE: {
    why: '금리 변화는 대출 이자, 채권 가격, 기업 가치평가에 전달되는 속도가 다르므로 발표와 실제 적용을 구분해야 합니다.',
    affected: '변동금리 대출자, 채권·성장주 투자자, 현금성 자산 보유자',
    checks: ['기준금리와 시장금리가 같은 방향인지', '내 대출의 금리 재산정 주기', '다음 중앙은행 회의와 물가 발표 일정'],
    indicators: ['KOSPI', 'SP500', 'GOLD'],
  },
  CRYPTO: {
    why: '암호자산은 가격 변화가 크기 때문에 방향 예측보다 변동성, 거래 집중, 손실 가능 범위를 먼저 확인하는 편이 안전합니다.',
    affected: '비트코인·암호자산 보유자와 고변동 자산 비중이 높은 사용자',
    checks: ['가격 변화와 거래량이 함께 증가했는지', '24시간 움직임을 장기 추세로 오해하지 않았는지', '감당 가능한 손실 범위를 넘지 않는지'],
    indicators: ['BTC'],
  },
};

async function loadBriefing(): Promise<{ articles: NewsArticle[]; indicators: Indicator[] }> {
  try {
    const [hotResponse, recentResponse, indicatorResponse] = await Promise.all([
      fetch(`${NEWS_API}/api/news/hot`, { cache: 'no-store' }),
      fetch(`${NEWS_API}/api/news?page=0&size=50&sort=publishedAt,desc`, { cache: 'no-store' }),
      fetch(`${NEWS_API}/api/market/indicators`, { cache: 'no-store' }),
    ]);
    const hot: NewsArticle[] = hotResponse.ok ? await hotResponse.json() : [];
    const recentPayload = recentResponse.ok ? await recentResponse.json() : {};
    const recent: NewsArticle[] = Array.isArray(recentPayload?.content) ? recentPayload.content : [];
    return {
      articles: rankNewsForBriefing([...hot, ...recent], 10),
      indicators: indicatorResponse.ok ? await indicatorResponse.json() : [],
    };
  } catch {
    return { articles: [], indicators: [] };
  }
}

export default async function BriefingPage() {
  const { articles, indicators } = await loadBriefing();
  const topArticles = articles.slice(0, 3);
  const generatedAt = new Date();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '오늘의 1분 머니 브리핑',
    url: `${SITE_URL}/briefing`,
    dateModified: generatedAt.toISOString(),
    publisher: { '@type': 'Organization', name: 'InvestBoard', url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: topArticles.map((article, index) => ({
        '@type': 'ListItem', position: index + 1, name: article.title,
        url: `${SITE_URL}/forum/news/${article.id}`,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <GrowthTracker contentType="daily_briefing" contentId={generatedAt.toISOString().slice(0, 10)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <header className="rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 via-card to-card p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-accent">INVESTBOARD DAILY</p>
            <h1 className="mt-2 text-3xl font-bold">오늘의 1분 머니 브리핑</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
              인기 순위만 보여주지 않고, 내부 반응·원문 공개 반응·네이버 검색 관심도와 시장지표를 분리해 오늘 확인할 질문으로 바꿉니다.
            </p>
            <p className="mt-3 text-[11px] text-text-secondary">업데이트 {formatDate(generatedAt)}</p>
          </div>
          <ShareButton title="오늘의 1분 머니 브리핑" path="/briefing" contentType="daily_briefing" />
        </div>
      </header>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold">시장 스냅샷</h2>
          <Link href="/market" className="text-xs text-accent-blue hover:underline">전체 지표 →</Link>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {sortIndicators(indicators).slice(0, 6).map(indicator => (
            <div key={indicator.type} className="rounded-lg border border-border bg-card p-3">
              <div className="text-[10px] text-text-secondary">{indicator.name}</div>
              <div className="mt-1 font-bold">{formatIndicator(indicator)}</div>
              <div className={`mt-1 text-xs font-semibold ${indicator.changePercent >= 0 ? 'text-[#f85149]' : 'text-[#58a6ff]'}`}>
                {indicator.changePercent > 0 ? '+' : ''}{indicator.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-bold">오늘 확인할 세 가지</h2>
          <p className="mt-1 text-xs text-text-secondary">아래 설명은 매수·매도 지시가 아니라 다음 확인 항목을 정리한 교육용 체크리스트입니다.</p>
        </div>

        {topArticles.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-text-secondary">브리핑 데이터를 불러오지 못했습니다. 잠시 후 다시 확인해주세요.</div>
        ) : topArticles.map((article, index) => {
          const guide = GUIDANCE[article.category] || GUIDANCE.DOMESTIC;
          const related = indicators.filter(item => guide.indicators.includes(item.type));
          return (
            <article id={`news-${article.id}`} key={article.id} className="scroll-mt-20 rounded-xl border border-border bg-card p-5 md:p-7">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                <strong className="text-accent">0{index + 1}</strong>
                <span>{CATEGORY_LABELS[article.category] || article.category}</span><span>·</span>
                <span>{article.sourceName}</span><span>·</span><time>{formatNewsDate(article.publishedAt)}</time>
              </div>
              <h3 className="text-xl font-bold leading-8">{article.title}</h3>
              {article.summary && <p className="mt-3 text-sm leading-7 text-text-secondary">{article.summary}</p>}

              <div className="mt-5"><EngagementMetrics article={article} showUnavailable /></div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-border/70 bg-bg/40 p-4">
                  <h4 className="text-xs font-bold text-accent">왜 확인할까</h4>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">{guide.why}</p>
                  <p className="mt-3 text-xs text-text-secondary"><strong className="text-text-primary">영향 대상:</strong> {guide.affected}</p>
                </div>
                <div className="rounded-lg border border-border/70 bg-bg/40 p-4">
                  <h4 className="text-xs font-bold text-accent">다음 확인 항목</h4>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-text-secondary">
                    {guide.checks.map(check => <li key={check}>• {check}</li>)}
                  </ul>
                </div>
              </div>

              {related.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {related.map(indicator => (
                    <span key={indicator.type} className="rounded-full border border-border bg-bg/50 px-3 py-1.5 text-xs">
                      {indicator.name} {indicator.changePercent > 0 ? '+' : ''}{indicator.changePercent.toFixed(2)}%
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <TrackedLink
                  href={`/forum/news/${article.id}`}
                  eventName="briefing_next_action"
                  properties={{ action: 'article_detail', rank: index + 1 }}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black"
                >
                  반응과 출처 확인
                </TrackedLink>
                {article.sourceUrl && (
                  <TrackedLink
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    eventName="briefing_next_action"
                    properties={{ action: 'source', rank: index + 1 }}
                    className="rounded-lg border border-border px-4 py-2 text-sm text-accent-blue"
                  >
                    원문 보기 ↗
                  </TrackedLink>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-border bg-card p-5 text-xs leading-6 text-text-secondary">
        <h2 className="mb-2 text-sm font-bold text-text-primary">데이터와 편집 원칙</h2>
        <p>뉴스 제목·요약은 원출처를 표시하고, InvestBoard의 내부 참여 수치와 외부 플랫폼 수치는 합산하지 않습니다. 외부 수치는 공식 API 또는 robots가 허용된 페이지의 공개 구조화 데이터만 사용합니다. 네이버 뉴스 댓글·추천 내부 API처럼 공식 제공되지 않고 자동 수집이 차단된 경로는 호출하지 않습니다.</p>
        <p className="mt-2">본 브리핑은 정보 제공 목적이며 개인별 투자 조언이나 수익 보장이 아닙니다.</p>
      </section>
    </div>
  );
}

function sortIndicators(indicators: Indicator[]): Indicator[] {
  const order = ['KOSPI', 'KOSDAQ', 'USD_KRW', 'SP500', 'BTC', 'GOLD'];
  return [...indicators].sort((a, b) => {
    const ai = order.indexOf(a.type);
    const bi = order.indexOf(b.type);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

function formatIndicator(indicator: Indicator): string {
  if (indicator.type === 'BTC' || indicator.type === 'GOLD') return `$${Math.round(indicator.value).toLocaleString()}`;
  return indicator.value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Asia/Seoul' }).format(date);
}

function formatNewsDate(value: string): string {
  if (!value) return '';
  return new Intl.DateTimeFormat('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Seoul' }).format(new Date(value));
}
