import type { NewsArticle } from '@/lib/news';

const FINANCE_TERMS: Array<[string, number]> = [
  ['기준금리', 8], ['코스피', 8], ['코스닥', 8], ['나스닥', 8], ['s&p', 8],
  ['환율', 8], ['원달러', 8], ['비트코인', 8], ['이더리움', 7], ['배당', 7],
  ['증시', 6], ['주가', 6], ['주식', 5], ['금리', 6], ['연준', 6], ['fomc', 7],
  ['반도체', 5], ['실적', 5], ['상장', 5], ['물가', 6], ['인플레이션', 6],
  ['고용', 4], ['관세', 5], ['무역', 4], ['수출', 4], ['수입', 4],
  ['부동산', 5], ['아파트', 4], ['대출', 6], ['은행', 4], ['채권', 6],
  ['세금', 5], ['연금', 5], ['etf', 6], ['유가', 5], ['원유', 5], ['금값', 5],
  ['투자', 4], ['금융', 4], ['경제', 3], ['기업', 2], ['시장', 2],
];

const NON_FINANCE_TERMS = [
  '화재', '대피', '사망', '살인', '폭행', '실종', '교통사고', '연예', '배우',
  '가수', '아이돌', '스포츠', '태풍', '폭우', '군대', '로봇개', '다이소',
];

export function rankNewsForBriefing(
  articles: NewsArticle[],
  limit = 10,
  now = new Date(),
): NewsArticle[] {
  const deduped = new Map<string, NewsArticle>();
  for (const article of articles) {
    if (!article?.id || !article?.title) continue;
    const key = article.sourceUrl || article.title.trim().toLowerCase();
    if (!deduped.has(key)) deduped.set(key, article);
  }

  const ranked = Array.from(deduped.values())
    .map(article => ({ article, score: scoreArticle(article, now) }))
    .filter(item => item.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  const selected: NewsArticle[] = [];
  const selectedIds = new Set<string>();
  const categories = new Set<string>();

  // 첫 순회에서는 서로 다른 금융 변수를 우선해 브리핑의 주제 편중을 줄입니다.
  for (const item of ranked) {
    if (selected.length >= limit) break;
    if (categories.has(item.article.category)) continue;
    selected.push(item.article);
    selectedIds.add(item.article.id);
    categories.add(item.article.category);
  }
  for (const item of ranked) {
    if (selected.length >= limit) break;
    if (selectedIds.has(item.article.id)) continue;
    selected.push(item.article);
    selectedIds.add(item.article.id);
  }
  return selected;
}

function scoreArticle(article: NewsArticle, now: Date): number | null {
  const text = `${article.title} ${article.summary || ''}`.toLowerCase();
  const relevance = FINANCE_TERMS.reduce(
    (score, [term, weight]) => score + (text.includes(term) ? weight : 0),
    0,
  );
  const hasNonFinanceSignal = NON_FINANCE_TERMS.some(term => text.includes(term));
  if (relevance < 5 || (hasNonFinanceSignal && relevance < 14)) return null;

  const publishedAt = parsePublishedAt(article.publishedAt);
  const ageHours = publishedAt
    ? Math.max(0, (now.getTime() - publishedAt.getTime()) / 3_600_000)
    : 72;
  const freshness = Math.max(0, 24 * (1 - ageHours / 48));
  const internal = Math.min(18, Math.log1p(Math.max(0, article.viewCount || 0)) * 2.2)
    + Math.min(8, (article.commentCount || 0) * 1.2 + (article.positiveVotes || 0) * 0.7);
  const external = Math.min(12, Math.max(0, article.externalEngagementScore || 0) / 200 * 12)
    + Math.min(8, Math.max(0, article.externalSearchInterest || 0) / 100 * 8)
    + Math.min(5, Math.max(0, article.externalTrendScore || 0) / 200 * 5);
  return relevance + freshness + internal + external;
}

function parsePublishedAt(value: string): Date | null {
  if (!value) return null;
  const hasTimezone = /(?:z|[+-]\d{2}:?\d{2})$/i.test(value);
  const parsed = new Date(hasTimezone ? value : `${value}+09:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
