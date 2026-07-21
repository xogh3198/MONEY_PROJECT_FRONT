'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ForumTabs from '@/components/forum/ForumTabs';

type Category = 'ALL' | 'DOMESTIC' | 'OVERSEAS' | 'FOREX' | 'RATE' | 'CRYPTO';
type TabType = 'hot' | 'realtime';

interface Article {
  id: string; title: string; summary: string; sourceName: string; sourceUrl?: string;
  category: string; sentiment: string; viewCount: number;
  commentCount: number; positiveVotes: number; negativeVotes: number;
  publishedAt: string;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'DOMESTIC', label: '🇰🇷 국내증시' },
  { value: 'OVERSEAS', label: '🇺🇸 해외증시' },
  { value: 'FOREX', label: '💱 환율' },
  { value: 'RATE', label: '📈 금리' },
  { value: 'CRYPTO', label: '₿ 암호화폐' },
];

export default function ForumPage() {
  const [tab, setTab] = useState<TabType>('realtime');
  const [category, setCategory] = useState<Category>('ALL');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    setPage(0);
    setArticles([]);
    loadArticles(0);
  }, [tab, category]);

  // 실시간 탭: 60초마다 자동 새로고침
  useEffect(() => {
    if (tab !== 'realtime') return;
    const interval = setInterval(() => {
      loadArticles(0);
      setLastUpdate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [tab, category]);

  const loadArticles = async (pageNum: number) => {
    setLoading(true);
    try {
      if (tab === 'hot') {
        const params = category !== 'ALL' ? `?category=${category}` : '';
        const res = await fetch(`/api/news-hot${params}`);
        const data = await res.json();
        setArticles(data || []);
        setHasMore(false); // hot은 최대 10개
      } else {
        const params = new URLSearchParams({ page: String(pageNum), size: '10', sort: 'publishedAt,desc' });
        if (category !== 'ALL') params.set('category', category);
        const res = await fetch(`/api/news-list?${params}`);
        const data = await res.json();
        if (pageNum === 0) {
          setArticles(data?.content || []);
        } else {
          setArticles(prev => [...prev, ...(data?.content || [])]);
        }
        setHasMore(!data?.last);
      }
    } catch {
      if (pageNum === 0) setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    loadArticles(next);
  };

  return (
    <div>
      <ForumTabs />
      <div className="mb-5">
        <h1 className="text-xl font-bold">경제뉴스</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-text-secondary">실시간 뉴스와 조회·댓글·평가 기반 인기 기사</p>
          {tab === 'realtime' && (
            <span className="text-[10px] text-accent animate-pulse">● LIVE</span>
          )}
        </div>
      </div>

      {/* 인기/실시간 탭 */}
      <div className="flex gap-1 mb-4">
        <button onClick={() => setTab('hot')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'hot' ? 'bg-accent text-black' : 'bg-card border border-border text-text-secondary hover:text-text-primary'
          }`}>
          🔥 인기
        </button>
        <button onClick={() => setTab('realtime')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'realtime' ? 'bg-accent text-black' : 'bg-card border border-border text-text-secondary hover:text-text-primary'
          }`}>
          ⚡ 실시간
        </button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)}
            className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition ${
              category === c.value
                ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                : 'bg-card border border-border text-text-secondary hover:text-text-primary'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* 기사 목록 */}
      {loading && articles.length === 0 ? (
        <div className="text-center py-12 text-text-secondary text-sm animate-pulse">불러오는 중...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-text-secondary text-sm">뉴스가 없습니다</div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden divide-y divide-border/50">
          {articles.map((article, idx) => (
            <ArticleRow key={article.id} article={article} rank={idx + 1} showRank={tab === 'hot'} />
          ))}
        </div>
      )}

      {/* 더보기 버튼 (실시간 탭) */}
      {tab === 'realtime' && hasMore && !loading && articles.length > 0 && (
        <div className="text-center mt-4">
          <button onClick={loadMore} className="px-6 py-2 bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition">
            더보기
          </button>
        </div>
      )}

      {loading && articles.length > 0 && (
        <div className="text-center py-4 text-text-secondary text-xs animate-pulse">로딩 중...</div>
      )}

      <p className="text-center text-[11px] text-text-secondary mt-8">
        ※ 본 정보는 투자 조언이 아닙니다. 투자 판단의 책임은 사용자에게 있습니다.
      </p>
    </div>
  );
}

function ArticleRow({ article, rank, showRank }: { article: Article; rank: number; showRank: boolean }) {
  const sentimentLabel = {
    POSITIVE: { text: '긍정', color: 'text-[#f85149] bg-[#f85149]/10' },
    NEGATIVE: { text: '부정', color: 'text-[#58a6ff] bg-[#58a6ff]/10' },
    NEUTRAL: { text: '중립', color: 'text-text-secondary bg-border/50' },
  }[article.sentiment] || { text: '중립', color: 'text-text-secondary bg-border/50' };

  const categoryMap: Record<string, string> = {
    DOMESTIC: '국내증시', OVERSEAS: '해외증시', FOREX: '환율', RATE: '금리', CRYPTO: '암호화폐',
  };

  return (
    <Link href={`/forum/news/${article.id}`} className="block px-5 py-4 hover:bg-[#1c2129] transition">
      <div className="flex items-center gap-2 mb-2 text-[11px]">
        {showRank && (
          <span className={`font-bold w-5 text-center ${rank <= 3 ? 'text-accent' : 'text-text-secondary'}`}>{rank}</span>
        )}
        <span className="text-text-secondary">{article.sourceName}</span>
        <span className="text-border">·</span>
        <span className="text-text-secondary">{timeAgo(article.publishedAt)}</span>
        {showRank && (
          <span className="text-[10px] text-text-secondary ml-1">👁 {(article.viewCount || 0).toLocaleString()}</span>
        )}
        <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-medium ${sentimentLabel.color}`}>
          {sentimentLabel.text}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-border/50 text-text-secondary">
          {categoryMap[article.category] || article.category}
        </span>
      </div>
      <h3 className="text-[14px] font-semibold text-text-primary mb-1 leading-snug">
        {article.title}
        <span className="text-accent-blue ml-1 text-[10px]">자세히 →</span>
      </h3>
      {article.summary && (
        <p className="text-[12px] text-text-secondary leading-relaxed mb-2 line-clamp-2">{article.summary}</p>
      )}
      <div className="flex items-center gap-4 text-[11px] text-text-secondary">
        <span>👁 {(article.viewCount || 0).toLocaleString()}</span>
        <span>💬 {(article.commentCount || 0).toLocaleString()}</span>
        <span className="text-[#f85149]">👍 {(article.positiveVotes || 0).toLocaleString()}</span>
        <span className="text-[#58a6ff]">👎 {(article.negativeVotes || 0).toLocaleString()}</span>
      </div>
    </Link>
  );
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return '방금';
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}
