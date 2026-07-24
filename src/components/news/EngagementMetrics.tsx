import {
  externalProviderLabel,
  externalStatusMessage,
  hasExternalCounts,
  integratedViewCount,
  NewsArticle,
  searchInterestPopularityPoints,
  searchInterestLabel,
} from '@/lib/news';

interface Props {
  article: NewsArticle;
  compact?: boolean;
  showUnavailable?: boolean;
}

export default function EngagementMetrics({ article, compact = false, showUnavailable = false }: Props) {
  const externalAvailable = hasExternalCounts(article);
  const searchInterest = typeof article.externalSearchInterest === 'number'
    ? article.externalSearchInterest
    : null;
  const searchPopularityPoints = searchInterestPopularityPoints(article);
  const combinedViews = integratedViewCount(article);

  if (compact) {
    return (
      <div className="space-y-1 text-[11px] text-text-secondary">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <span title={`검색 관심 환산 ${searchPopularityPoints.toLocaleString()} + 사이트 실제 ${(article.viewCount || 0).toLocaleString()}`}>
            👁 조회 {combinedViews.toLocaleString()}
          </span>
          <span>💬 {(article.commentCount || 0).toLocaleString()}</span>
          <span className="text-[#f85149]">👍 {(article.positiveVotes || 0).toLocaleString()}</span>
          <span className="text-[#58a6ff]">👎 {(article.negativeVotes || 0).toLocaleString()}</span>
        </div>
        {externalAvailable && (
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-accent-blue">
            <span>원문 {formatExternalCounts(article)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <section className="rounded-lg border border-border/70 bg-bg/40 px-4 py-3">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          통합 조회·InvestBoard 반응
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-secondary">
          <span>👁 조회 {combinedViews.toLocaleString()}</span>
          <span>💬 댓글 {article.commentCount.toLocaleString()}</span>
          <span className="text-[#f85149]">👍 좋아요 {article.positiveVotes.toLocaleString()}</span>
          <span className="text-[#58a6ff]">👎 싫어요 {article.negativeVotes.toLocaleString()}</span>
        </div>
        <p className="mt-2 text-[10px] text-text-secondary">
          검색 관심 환산 {searchPopularityPoints.toLocaleString()} + 사이트 실제 조회 {(article.viewCount || 0).toLocaleString()}
        </p>
      </section>

      <section className="rounded-lg border border-border/70 bg-bg/40 px-4 py-3">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          외부 관심 신호
        </div>
        {externalAvailable ? (
          <>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-accent-blue">
              {externalMetricItems(article).map(item => <span key={item}>{item}</span>)}
            </div>
            <p className="mt-2 text-[10px] text-text-secondary">
              출처: {externalProviderLabel(article.externalMetricProvider)} · InvestBoard 수치와 별도
            </p>
          </>
        ) : showUnavailable && article.externalMetricStatus ? (
          <p className="text-xs leading-relaxed text-text-secondary">
            {externalStatusMessage(article.externalMetricStatus)}
          </p>
        ) : (
          <p className="text-xs text-text-secondary">공개된 원문 반응 수치가 없습니다.</p>
        )}
        {searchInterest !== null && (
          <div className="mt-3 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between text-xs">
              <span>네이버 DataLab {searchInterestLabel(article)}</span>
              <strong className="text-accent">{Math.round(searchInterest)}/100</strong>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(0, Math.min(100, searchInterest))}%` }} />
            </div>
            <p className="mt-2 text-[10px] text-text-secondary">
              조회수에 검색 관심 환산값 {searchPopularityPoints.toLocaleString()}을 반영합니다.
              {article.externalSearchInterestSource === 'NAVER_DATALAB_ARTICLE_KEYWORDS'
                ? ' 최근 기사 제목의 핵심 검색어를 공통 기준어와 비교한 값입니다.'
                : ' 기사별 값이 없어 분야값을 임시 보조 신호로 사용 중입니다.'}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function externalMetricItems(article: NewsArticle): string[] {
  const items: string[] = [];
  if (typeof article.externalViewCount === 'number') items.push(`👁 조회 ${article.externalViewCount.toLocaleString()}`);
  if (typeof article.externalCommentCount === 'number') items.push(`💬 댓글 ${article.externalCommentCount.toLocaleString()}`);
  if (typeof article.externalPositiveCount === 'number') items.push(`👍 좋아요 ${article.externalPositiveCount.toLocaleString()}`);
  if (typeof article.externalNegativeCount === 'number') items.push(`👎 싫어요 ${article.externalNegativeCount.toLocaleString()}`);
  return items;
}

function formatExternalCounts(article: NewsArticle): string {
  return externalMetricItems(article).join(' · ');
}
