export interface NewsArticleInput {
  id: string;
  title: string;
  summary?: string;
  sourceName?: string;
  sourceUrl?: string;
  category?: string;
  sentiment?: string;
  viewCount?: number;
  commentCount?: number;
  positiveVotes?: number;
  negativeVotes?: number;
  publishedAt?: string;
}

export interface MarketIndicatorInput {
  type: string;
  name: string;
  value: number;
  changePercent: number;
  prediction?: string;
  updatedAt?: string;
}

export interface ContentOpportunity {
  id: string;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  sentiment: string;
  publishedAt: string;
  trendScore: number;
  signals: string[];
  riskFlags: string[];
  angle: string;
  hook: string;
  sitePath: string;
  marketContext: string[];
}

export interface ContentScene {
  order: number;
  seconds: number;
  narration: string;
  onScreenText: string;
  visualDirection: string;
}

export interface ContentScriptDraft {
  experimentId: string;
  status: 'DRAFT';
  requiresHumanReview: true;
  generatedAt: string;
  title: string;
  hook: string;
  targetAudience: string;
  durationSeconds: number;
  narration: string;
  scenes: ContentScene[];
  caption: string;
  hashtags: string[];
  siteCta: string;
  disclaimer: string;
  aiDisclosure: string;
  factChecks: string[];
  sourceCredits: string[];
}

const FINANCE_TERMS: Array<[string, number]> = [
  ['금리', 14], ['기준금리', 16], ['fomc', 16], ['연준', 14],
  ['환율', 14], ['달러', 10], ['원화', 10], ['엔화', 9],
  ['코스피', 14], ['코스닥', 14], ['증시', 10], ['주가', 10], ['주식', 9],
  ['나스닥', 12], ['s&p', 12], ['다우', 10], ['월가', 8],
  ['비트코인', 13], ['이더리움', 11], ['암호화폐', 10], ['코인', 7],
  ['반도체', 10], ['ai', 6], ['인공지능', 6], ['실적', 9], ['상장', 7],
  ['물가', 12], ['인플레이션', 12], ['고용', 7], ['무역', 7], ['관세', 10],
  ['부동산', 10], ['아파트', 7], ['전세', 8], ['대출', 10], ['근저당', 8],
  ['세금', 9], ['절세', 9], ['연금', 9], ['배당', 11], ['etf', 10],
  ['유가', 9], ['원유', 9], ['금값', 9], ['금 가격', 9], ['채권', 10],
];

const HIGH_RISK_TERMS = ['무조건', '확정', '대박', '폭등 보장', '수익 보장', '지금 사라', '매수 추천'];

const NON_FINANCE_NEWS_TERMS = [
  '화재', '대피', '사망', '살인', '폭행', '실종', '교통사고', '로봇청소기',
  '연예', '배우', '가수', '방송인', '아이돌', '스포츠', '태풍', '폭우',
  '대통령', '선거', '정당', '신천지',
];

const CATEGORY_ANGLES: Record<string, { angle: string; sitePath: string }> = {
  DOMESTIC: { angle: '한국 증시와 가계 자산에 어떤 변수가 되는지 숫자로 설명', sitePath: '/market' },
  OVERSEAS: { angle: '해외 시장 변화가 다음 국내 장에 전달되는 경로를 설명', sitePath: '/market' },
  FOREX: { angle: '환율 변화가 해외투자·수입물가·여행 비용에 미치는 영향을 설명', sitePath: '/tools' },
  RATE: { angle: '금리 변화가 대출·채권·주식 가치에 미치는 영향을 설명', sitePath: '/calendar' },
  CRYPTO: { angle: '가격 움직임과 위험 요인을 분리해 변동성 관점에서 설명', sitePath: '/market' },
};

export function buildContentOpportunities(
  articles: NewsArticleInput[],
  indicators: MarketIndicatorInput[],
  limit = 12,
  now = new Date(),
): ContentOpportunity[] {
  const deduped = new Map<string, NewsArticleInput>();

  for (const article of articles) {
    if (!article?.id || !article?.title) continue;
    const key = article.sourceUrl || article.title.trim().toLowerCase();
    const previous = deduped.get(key);
    if (!previous || (article.viewCount || 0) > (previous.viewCount || 0)) {
      deduped.set(key, article);
    }
  }

  return Array.from(deduped.values())
    .map(article => scoreOpportunity(article, indicators, now))
    .filter((item): item is ContentOpportunity => item !== null)
    .sort((a, b) => b.trendScore - a.trendScore)
    .slice(0, Math.max(1, Math.min(limit, 30)));
}

function scoreOpportunity(
  article: NewsArticleInput,
  indicators: MarketIndicatorInput[],
  now: Date,
): ContentOpportunity | null {
  const text = `${article.title} ${article.summary || ''}`.toLowerCase();
  const matchedTerms = FINANCE_TERMS.filter(([term]) => text.includes(term));
  const relevance = Math.min(36, matchedTerms.reduce((sum, [, weight]) => sum + weight, 0));
  const hasNonFinanceNewsSignal = NON_FINANCE_NEWS_TERMS.some(term => text.includes(term));

  if (relevance < 7 || (hasNonFinanceNewsSignal && relevance < 18)) return null;

  const published = parsePublishedAt(article.publishedAt);
  const ageHours = published ? Math.max(0, (now.getTime() - published.getTime()) / 3_600_000) : 72;
  const freshness = Math.max(0, 24 * (1 - ageHours / 48));
  const popularity = Math.min(22, Math.log1p(Math.max(0, article.viewCount || 0)) * 3.2);
  const engagement = Math.min(
    8,
    (article.commentCount || 0) * 1.5 +
      (article.positiveVotes || 0) * 0.8 +
      (article.negativeVotes || 0) * 0.5,
  );

  const relatedIndicators = getRelatedIndicators(article.category || '', text, indicators);
  const marketMovement = relatedIndicators.length
    ? Math.min(10, Math.max(...relatedIndicators.map(item => Math.abs(item.changePercent))) * 1.6)
    : 0;

  const explanationValue = /왜|영향|전망|변화|인하|인상|급등|급락|최고|최저|돌파/.test(text) ? 5 : 2;
  const riskFlags: string[] = [];

  if (!article.summary?.trim()) riskFlags.push('본문 요약이 없어 원문 사실 확인 필요');
  if (!article.sourceName || article.sourceName === '기타') riskFlags.push('매체 식별 확인 필요');
  if (HIGH_RISK_TERMS.some(term => text.includes(term))) riskFlags.push('과장 또는 투자 지시 표현 제거 필요');
  if (/정치|대통령|선거|전쟁/.test(text)) riskFlags.push('민감 주제: 추가 출처와 중립성 검토 필요');

  const riskPenalty = riskFlags.length * 2;
  const score = Math.max(
    1,
    Math.min(100, Math.round(relevance + freshness + popularity + engagement + marketMovement + explanationValue - riskPenalty)),
  );

  const category = article.category || 'DOMESTIC';
  const strategy = CATEGORY_ANGLES[category] || CATEGORY_ANGLES.DOMESTIC;
  const signals = [
    `금융 핵심어: ${matchedTerms.slice(0, 4).map(([term]) => term).join(', ')}`,
    ageHours <= 48 ? `최신성: 약 ${Math.round(ageHours)}시간 전` : '최신성 낮음: 발행 시각 재확인',
    `내부 관심 신호: ${Math.max(0, article.viewCount || 0).toLocaleString()}`,
  ];

  if (relatedIndicators.length) {
    signals.push(
      `연결 지표: ${relatedIndicators
        .slice(0, 2)
        .map(item => `${item.name} ${formatSigned(item.changePercent)}%`)
        .join(', ')}`,
    );
  }

  return {
    id: article.id,
    title: article.title,
    summary: article.summary || '',
    sourceName: article.sourceName || '매체 확인 필요',
    sourceUrl: article.sourceUrl || '',
    category,
    sentiment: article.sentiment || 'NEUTRAL',
    publishedAt: article.publishedAt || '',
    trendScore: score,
    signals,
    riskFlags,
    angle: strategy.angle,
    hook: `“${truncate(article.title, 44)}” 지금 이 변화가 중요한 이유를 1분 안에 확인해보세요.`,
    sitePath: strategy.sitePath,
    marketContext: relatedIndicators.map(
      item => `${item.name}: ${item.value.toLocaleString('ko-KR')} (${formatSigned(item.changePercent)}%)`,
    ),
  };
}

function getRelatedIndicators(
  category: string,
  text: string,
  indicators: MarketIndicatorInput[],
): MarketIndicatorInput[] {
  const wanted = new Set<string>();

  if (category === 'DOMESTIC') ['KOSPI', 'KOSDAQ'].forEach(type => wanted.add(type));
  if (category === 'OVERSEAS') wanted.add('SP500');
  if (category === 'FOREX') wanted.add('USD_KRW');
  if (category === 'CRYPTO') wanted.add('BTC');
  if (text.includes('금값') || text.includes('금 가격') || text.includes('금리')) wanted.add('GOLD');
  if (text.includes('달러') || text.includes('환율')) wanted.add('USD_KRW');
  if (text.includes('비트코인') || text.includes('코인')) wanted.add('BTC');

  return indicators.filter(item => wanted.has(item.type)).sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
}

function parsePublishedAt(value?: string): Date | null {
  if (!value) return null;
  const hasTimezone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(value);
  const parsed = new Date(hasTimezone ? value : `${value}+09:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatSigned(value: number): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
}

function truncate(value: string, maxLength: number): string {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`;
}
