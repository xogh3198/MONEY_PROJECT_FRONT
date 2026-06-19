'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchIndicators, fetchHotNews } from '@/lib/api';
import { IndicatorSkeleton, NewsListSkeleton } from '@/components/Skeleton';

interface Indicator { type: string; name: string; value: number; changePercent: number; }
interface NewsItem { id: string; title: string; summary?: string; sourceName: string; publishedAt: string; commentCount: number; category: string; sentiment: string; viewCount?: number; sourceUrl?: string; }

export default function HomePage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    fetchIndicators().then(d => { if (d?.length) setIndicators(d); }).catch(() => {}).finally(() => setLoadingIndicators(false));
    fetchHotNews().then(d => { if (d?.length) setNews(d); }).catch(() => {}).finally(() => setLoadingNews(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* ?œì¥ ì§€??*/}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary">?¤ì‹œê°??œì¥ì§€??/h2>
          <Link href="/market" className="text-xs text-accent-blue hover:underline">?ì„¸ ??/Link>
        </div>
        {loadingIndicators ? <IndicatorSkeleton /> : (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {sortIndicators(indicators).map(ind => {
            const isUp = ind.changePercent >= 0;
            return (
              <div key={ind.type} className="bg-card rounded-lg border border-border p-3 hover:border-border/80 transition group">
                <div className="text-[11px] text-text-secondary mb-1">{ind.name}</div>
                <div className="text-[16px] font-bold tracking-tight">
                  {ind.type === 'BTC' || ind.type === 'GOLD' ? `$${Math.round(ind.value).toLocaleString()}` : ind.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </div>
                <div className={`text-[12px] font-semibold mt-0.5 ${isUp ? 'text-[#f85149]' : ind.changePercent < 0 ? 'text-[#58a6ff]' : 'text-text-secondary'}`}>
                  {ind.changePercent === 0 ? '??0.00%' : `${isUp ? '?? : '??} ${Math.abs(ind.changePercent).toFixed(2)}%`}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* ë©”ì¸ ê·¸ë¦¬??*/}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* ?´ìŠ¤ */}
        <section className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex justify-between items-center">
            <h2 className="text-sm font-bold">?”¥ ?¤ì‹œê°?ê²½ì œ?´ìŠ¤</h2>
            <Link href="/forum" className="text-xs text-accent-blue hover:underline">?„ì²´ë³´ê¸° ??/Link>
          </div>
          <div className="divide-y divide-border/50">
            {news.slice(0, 10).map((item, idx) => (
              <a key={item.id} href={item.sourceUrl || '/forum'} target={item.sourceUrl ? '_blank' : '_self'} rel="noopener noreferrer" className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#1c2129] transition">
                <span className={`flex-shrink-0 mt-1 text-xs font-bold w-5 text-center ${idx < 3 ? 'text-accent' : 'text-text-secondary'}`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      item.sentiment === 'POSITIVE' ? 'bg-[#f85149]' :
                      item.sentiment === 'NEGATIVE' ? 'bg-[#58a6ff]' : 'bg-text-secondary'
                    }`} />
                    <p className="text-[13px] font-medium text-text-primary truncate">{item.title}</p>
                  </div>
                  {item.summary && (
                    <p className="text-[11px] text-text-secondary truncate">{item.summary}</p>
                  )}
                  <div className="flex gap-2 mt-1 text-[11px] text-text-secondary">
                    <span>{item.sourceName}</span>
                    <span>Â·</span>
                    <span>{item.category}</span>
                    {item.viewCount ? <span className="ml-auto">?‘ {item.viewCount.toLocaleString()}</span> : null}
                    <span>?’¬ {item.commentCount}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ?¬ì´?œë°” */}
        <aside className="space-y-4">
          {/* ë¹ ë¥¸ ?¡ì„¸??*/}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold">?„êµ¬</h3>
            </div>
            <div className="p-3 space-y-1">
              <Link href="/market" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#1f6feb]/20 flex items-center justify-center text-lg">?“Š</div>
                <div>
                  <div className="text-sm font-medium">?œì¥ ?ˆì¸¡</div>
                  <div className="text-[11px] text-text-secondary">AI ê¸°ë°˜ ?ë¦„ ë¶„ì„</div>
                </div>
              </Link>
              <Link href="/calendar" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#d29922]/20 flex items-center justify-center text-lg">?“…</div>
                <div>
                  <div className="text-sm font-medium">ê²½ì œ ìº˜ë¦°??/div>
                  <div className="text-[11px] text-text-secondary">FOMC, ê¸ˆí†µ?? ?¤ì </div>
                </div>
              </Link>
              <Link href="/tools" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-lg">?’±</div>
                <div>
                  <div className="text-sm font-medium">?¬ì ?„êµ¬</div>
                  <div className="text-[11px] text-text-secondary">?˜ìœ¨Â·?¸ê¸ˆ ê³„ì‚°ê¸?/div>
                </div>
              </Link>
              <Link href="/search" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#f85149]/20 flex items-center justify-center text-lg">?”</div>
                <div>
                  <div className="text-sm font-medium">ì¢…ëª© ê²€??/div>
                  <div className="text-[11px] text-text-secondary">ì£¼ì‹ ?•ë³´ ì¡°íšŒ</div>
                </div>
              </Link>
              <Link href="/dividend" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#a371f7]/20 flex items-center justify-center text-lg">?’°</div>
                <div>
                  <div className="text-sm font-medium">ë°°ë‹¹ ê´€ë¦?/div>
                  <div className="text-[11px] text-text-secondary">?¬íŠ¸?´ë¦¬??ë°°ë‹¹ ìº˜ë¦°??/div>
                </div>
              </Link>
            </div>
          </div>

          {/* ê°„ë‹¨ ê³µì? */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-text-secondary leading-relaxed">
              ?’¡ <span className="text-text-primary font-medium">InvestBoard</span>?€ ?¬ì ?•ë³´ ?œê³µ ?Œë«?¼ì…?ˆë‹¤.
              ëª¨ë“  ?¬ì ?ë‹¨??ì±…ì„?€ ?¬ìš©?ì—ê²??ˆìŠµ?ˆë‹¤.
            </div>
          </div>
        </aside>
      </div>
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
