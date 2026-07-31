'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ForumTabs from '@/components/forum/ForumTabs';
import EngagementMetrics from '@/components/news/EngagementMetrics';
import { CATEGORY_LABELS, NewsArticle } from '@/lib/news';

type SearchResponse = {
  content?: NewsArticle[];
  totalElements?: number;
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const normalized = query.trim();
    const delay = normalized.length >= 2 ? 300 : 0;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const endpoint = normalized.length >= 2
          ? `/api/news-search?query=${encodeURIComponent(normalized)}&size=20`
          : '/api/news-hot';
        const response = await fetch(endpoint, {
          cache: 'no-store',
          signal: controller.signal,
        });
        const data: SearchResponse | NewsArticle[] = await response.json();
        if (!response.ok) {
          throw new Error(!Array.isArray(data) && 'error' in data
            ? String(data.error)
            : '뉴스를 불러오지 못했습니다.');
        }

        const items = Array.isArray(data) ? data : data.content || [];
        setArticles(items);
        setTotal(Array.isArray(data) ? items.length : data.totalElements || items.length);
      } catch (searchError) {
        if (controller.signal.aborted) return;
        setArticles([]);
        setTotal(0);
        setError(searchError instanceof Error ? searchError.message : '뉴스를 불러오지 못했습니다.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, retryKey]);

  const isSearching = query.trim().length >= 2;

  return (
    <div>
      <ForumTabs />
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-accent">LIVE NEWS SEARCH</p>
        <h1 className="mt-2 text-xl font-bold">뉴스 검색</h1>
        <p className="mt-1 text-xs text-text-secondary">
          고정된 종목 가격이 아니라 현재 수집된 뉴스 제목·요약·언론사를 검색합니다.
        </p>
      </header>

      <label className="block">
        <span className="sr-only">뉴스 검색어</span>
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="두 글자 이상 입력 (예: 삼성전자, 환율, 금리)"
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm focus:border-accent focus:outline-none"
          autoFocus
        />
      </label>

      <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
        <span>{isSearching ? `검색 결과 ${total.toLocaleString()}건` : '최근 인기 뉴스'}</span>
        <Link href="/forum" className="text-accent-blue hover:underline">뉴스 홈 →</Link>
      </div>

      {loading ? (
        <div className="mt-5 rounded-lg border border-border bg-card py-12 text-center text-sm text-text-secondary animate-pulse">
          실제 뉴스 데이터를 불러오는 중입니다.
        </div>
      ) : error ? (
        <div className="mt-5 rounded-lg border border-negative/30 bg-negative/10 p-6 text-center">
          <p className="text-sm text-negative">{error}</p>
          <button
            type="button"
            onClick={() => setRetryKey(value => value + 1)}
            className="mt-4 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:border-accent"
          >
            다시 시도
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="mt-5 rounded-lg border border-border bg-card py-12 text-center">
          <p className="text-sm text-text-primary">일치하는 뉴스가 없습니다.</p>
          <p className="mt-2 text-xs text-text-secondary">종목명 대신 산업·금리·환율 같은 주제로도 검색해보세요.</p>
        </div>
      ) : (
        <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card divide-y divide-border/50">
          {articles.map(article => <NewsSearchResult key={article.id} article={article} />)}
        </div>
      )}
    </div>
  );
}

function NewsSearchResult({ article }: { article: NewsArticle }) {
  return (
    <Link href={`/forum/news/${article.id}`} className="block px-5 py-4 transition hover:bg-[#1c2129]">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-secondary">
        <span>{article.sourceName}</span>
        <span>·</span>
        <span>{CATEGORY_LABELS[article.category] || article.category}</span>
        <time className="ml-auto">{formatDate(article.publishedAt)}</time>
      </div>
      <h2 className="mt-2 text-sm font-semibold leading-snug text-text-primary">{article.title}</h2>
      {article.summary && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-secondary">{article.summary}</p>
      )}
      <div className="mt-3">
        <EngagementMetrics article={article} compact />
      </div>
    </Link>
  );
}

function formatDate(value: string): string {
  if (!value) return '';
  return new Date(value).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
