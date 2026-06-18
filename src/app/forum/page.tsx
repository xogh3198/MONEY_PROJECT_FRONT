'use client';
import { useState, useEffect } from 'react';
import { fetchNewsByCategory } from '@/lib/api';

type Category = 'ALL' | 'DOMESTIC' | 'OVERSEAS' | 'FOREX' | 'RATE' | 'CRYPTO';

interface Article {
  id: string; title: string; summary: string; sourceName: string;
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
  const [category, setCategory] = useState<Category>('ALL');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [category]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await fetchNewsByCategory(category === 'ALL' ? undefined : category);
      if (data?.content?.length > 0) {
        setArticles(data.content);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-5">
        <h1 className="text-xl font-bold">경제뉴스</h1>
        <p className="text-xs text-text-secondary mt-1">실시간 경제 뉴스와 시장 분석</p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-1 mb-5 border-b border-border pb-px">
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCategory(c.value)}
            className={`px-3 py-2 text-sm rounded-t transition ${
              category === c.value
                ? 'text-accent border-b-2 border-accent font-medium'
                : 'text-text-secondary hover:text-text-primary'
            }`}>
            {c.label}
          </button>
        ))}
      </div>

      {/* 뉴스 리스트 */}
      {loading ? (
        <div className="text-center py-12 text-text-secondary text-sm">불러오는 중...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 text-text-secondary text-sm">뉴스가 없습니다</div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden divide-y divide-border/50">
          {articles.map((article, idx) => (
            <ArticleRow key={article.id} article={article} rank={idx + 1} />
          ))}
        </div>
      )}

      <p className="text-center text-[11px] text-text-secondary mt-8">
        ※ 본 정보는 투자 조언이 아닙니다. 투자 판단의 책임은 사용자에게 있습니다.
      </p>
    </div>
  );
}

function ArticleRow({ article, rank }: { article: Article; rank: number }) {
  const sentimentLabel = {
    POSITIVE: { text: '긍정', color: 'text-[#f85149] bg-[#f85149]/10' },
    NEGATIVE: { text: '부정', color: 'text-[#58a6ff] bg-[#58a6ff]/10' },
    NEUTRAL: { text: '중립', color: 'text-text-secondary bg-border/50' },
  }[article.sentiment] || { text: '중립', color: 'text-text-secondary bg-border/50' };

  const categoryLabel = {
    DOMESTIC: '국내증시', OVERSEAS: '해외증시', FOREX: '환율', RATE: '금리', CRYPTO: '암호화폐',
  }[article.category] || article.category;

  const timeAgo = getTimeAgo(article.publishedAt);

  return (
    <div className="px-5 py-4 hover:bg-[#1c2129] transition cursor-pointer">
      {/* 상단: 메타 */}
      <div className="flex items-center gap-2 mb-2 text-[11px]">
        <span className={`font-bold w-5 text-center ${rank <= 3 ? 'text-accent' : 'text-text-secondary'}`}>{rank}</span>
        <span className="text-text-secondary">{article.sourceName}</span>
        <span className="text-border">·</span>
        <span className="text-text-secondary">{timeAgo}</span>
        <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-medium ${sentimentLabel.color}`}>
          {sentimentLabel.text}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] bg-border/50 text-text-secondary">{categoryLabel}</span>
      </div>

      {/* 제목 */}
      <h3 className="text-[14px] font-semibold text-text-primary mb-1 leading-snug">{article.title}</h3>

      {/* 요약 */}
      {article.summary && (
        <p className="text-[12px] text-text-secondary leading-relaxed mb-2 line-clamp-2">{article.summary}</p>
      )}

      {/* 하단: 통계 */}
      <div className="flex items-center gap-4 text-[11px] text-text-secondary">
        <span>👁 {article.viewCount.toLocaleString()}</span>
        <span>💬 {article.commentCount}</span>
        <span className="text-[#f85149]">👍 {article.positiveVotes}</span>
        <span className="text-[#58a6ff]">👎 {article.negativeVotes}</span>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return '방금';
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}
