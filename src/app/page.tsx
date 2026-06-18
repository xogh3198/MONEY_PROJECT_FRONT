'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchIndicators, fetchHotNews } from '@/lib/api';

interface Indicator { type: string; name: string; value: number; changePercent: number; }
interface NewsItem { id: string; title: string; sourceName: string; publishedAt: string; commentCount: number; category: string; sentiment: string; }

export default function HomePage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchIndicators().then(d => { if (d?.length) setIndicators(d); }).catch(() => {});
    fetchHotNews().then(d => { if (d?.length) setNews(d); }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      {/* 시장 지표 카드 */}
      <section className="grid grid-cols-6 gap-3">
        {indicators.map(ind => (
          <div key={ind.type} className="bg-card border border-border rounded-lg p-3 text-center">
            <div className="text-[11px] text-text-secondary mb-1">{ind.name}</div>
            <div className="text-[15px] font-bold">{ind.type === 'BTC' ? `$${Math.round(ind.value).toLocaleString()}` : ind.value.toLocaleString()}</div>
            <div className={`text-[12px] font-medium ${ind.changePercent >= 0 ? 'text-accent' : 'text-negative'}`}>
              {ind.changePercent >= 0 ? '▲' : '▼'} {Math.abs(ind.changePercent).toFixed(2)}%
            </div>
          </div>
        ))}
      </section>

      {/* 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* 뉴스 */}
        <section className="bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex justify-between items-center">
            <h2 className="text-sm font-bold">경제 뉴스</h2>
            <Link href="/forum" className="text-xs text-text-secondary hover:text-accent">더보기 →</Link>
          </div>
          <ul>
            {news.slice(0, 8).map(item => (
              <li key={item.id} className="px-4 py-3 border-b border-border/50 last:border-0 hover:bg-border/20 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${item.sentiment === 'POSITIVE' ? 'bg-accent' : item.sentiment === 'NEGATIVE' ? 'bg-negative' : 'bg-text-secondary'}`} />
                  <span className="text-[13px] font-medium text-text-primary">{item.title}</span>
                </div>
                <div className="flex gap-2 text-[11px] text-text-secondary pl-3.5">
                  <span>{item.sourceName}</span>
                  <span>·</span>
                  <span>{item.category}</span>
                  <span className="ml-auto">💬 {item.commentCount}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 사이드 */}
        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="text-sm font-bold mb-3">투자 도구</h3>
            <Link href="/market" className="flex items-center gap-3 p-2 rounded hover:bg-border/30 mb-2">
              <span>📊</span>
              <div><div className="text-sm">시장 예측</div><div className="text-[11px] text-text-secondary">AI 흐름 분석</div></div>
            </Link>
            <Link href="/dividend" className="flex items-center gap-3 p-2 rounded hover:bg-border/30">
              <span>💰</span>
              <div><div className="text-sm">배당 캘린더</div><div className="text-[11px] text-text-secondary">포트폴리오 관리</div></div>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
