'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NewsCommentSection from '@/components/news/NewsCommentSection';
import NewsVoteButton from '@/components/news/NewsVoteButton';
import EngagementMetrics from '@/components/news/EngagementMetrics';
import GrowthTracker from '@/components/analytics/GrowthTracker';
import ShareButton from '@/components/ShareButton';
import { CATEGORY_LABELS, NewsArticle } from '@/lib/news';

export default function NewsArticleClient({
  articleId,
  initialArticle,
}: {
  articleId: string;
  initialArticle: NewsArticle | null;
}) {
  const [article, setArticle] = useState<NewsArticle | null>(initialArticle);
  const [loading, setLoading] = useState(!initialArticle);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const res = await fetch(`/api/news/${articleId}`, { cache: 'no-store' });
        if (!res.ok) throw new Error('기사를 찾을 수 없습니다.');
        setArticle(await res.json());
      } catch (err) {
        if (!initialArticle) setError(err instanceof Error ? err.message : '기사를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    void loadArticle();
  }, [articleId, initialArticle]);

  if (loading) return <div className="py-16 text-center text-sm text-text-secondary">기사를 불러오는 중입니다.</div>;
  if (!article || error) {
    return (
      <div className="py-16 text-center">
        <p className="mb-4 text-sm text-text-secondary">{error || '기사를 찾을 수 없습니다.'}</p>
        <Link href="/forum" className="text-sm text-accent-blue hover:underline">뉴스 목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <GrowthTracker contentType="source_news" contentId={article.id} />
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/forum" className="inline-flex text-xs text-text-secondary hover:text-text-primary">← 뉴스 목록</Link>
        <ShareButton title={article.title} path={`/forum/news/${article.id}`} contentType="source_news" />
      </div>

      <article className="mb-6 rounded-xl border border-border bg-card p-5 md:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-text-secondary">
          <span className="rounded bg-accent-blue/10 px-2 py-1 text-accent-blue">
            {CATEGORY_LABELS[article.category] || article.category}
          </span>
          <span>{article.sourceName}</span><span>·</span><time>{formatDate(article.publishedAt)}</time>
        </div>

        <h1 className="mb-4 text-xl font-bold leading-snug text-text-primary md:text-2xl">{article.title}</h1>
        {article.summary ? (
          <p className="mb-5 whitespace-pre-wrap text-sm leading-7 text-text-secondary">{article.summary}</p>
        ) : (
          <p className="mb-5 text-sm text-text-secondary">기사 요약이 제공되지 않았습니다. 원문에서 내용을 확인해주세요.</p>
        )}

        <div className="mb-5">
          <EngagementMetrics article={article} showUnavailable />
        </div>

        <div className="mb-5 rounded-lg border border-accent/20 bg-accent/5 p-4 text-xs leading-6 text-text-secondary">
          <strong className="text-text-primary">숫자 읽는 법</strong><br />
          내부 반응은 InvestBoard 방문자의 활동이고, 외부 관심 신호는 원문이 공개한 표준 데이터 또는 공식 API의 값입니다.
          서로 다른 모집단이므로 합산하지 않습니다.
        </div>

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <NewsVoteButton
            articleId={article.id}
            positiveVotes={article.positiveVotes}
            negativeVotes={article.negativeVotes}
            onChange={(positiveVotes, negativeVotes) =>
              setArticle(current => current ? { ...current, positiveVotes, negativeVotes } : current)
            }
          />
          {article.sourceUrl && article.sourceUrl !== '#' && !article.sourceUrl.includes('example.com') && (
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-4 py-2 text-sm text-accent-blue hover:bg-bg/40">
              원문 보기 ↗
            </a>
          )}
        </div>
      </article>

      <NewsCommentSection
        articleId={article.id}
        onCommentAdded={() => setArticle(current => current ? { ...current, commentCount: current.commentCount + 1 } : current)}
      />
      <p className="mt-8 text-center text-[11px] text-text-secondary">본 정보와 댓글은 투자 조언이 아니며, 투자 판단의 책임은 사용자에게 있습니다.</p>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}
