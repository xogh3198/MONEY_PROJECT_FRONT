'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchIndicators, fetchHotNews } from '@/lib/api';
import { IndicatorSkeleton, NewsListSkeleton } from '@/components/Skeleton';
import EngagementMetrics from '@/components/news/EngagementMetrics';
import TrackedLink from '@/components/analytics/TrackedLink';
import { CATEGORY_LABELS, NewsArticle } from '@/lib/news';

interface Indicator { type: string; name: string; value: number; changePercent: number; }
export default function HomePage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingIndicators, setLoadingIndicators] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    fetchIndicators().then(d => { if (d?.length) setIndicators(d); }).catch(() => {}).finally(() => setLoadingIndicators(false));
    fetchHotNews().then(d => { if (d?.length) setNews(d); }).catch(() => {}).finally(() => setLoadingNews(false));
  }, []);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-accent/25 bg-gradient-to-br from-accent/10 via-card to-card">
        <div className="flex flex-col gap-3 border-b border-border/70 px-5 py-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-[10px] font-semibold tracking-widest text-accent">DAILY MONEY BRIEFING</p>
            <h1 className="text-xl font-bold md:text-2xl">오늘 내 돈에 영향을 주는 3가지</h1>
            <p className="mt-2 text-xs text-text-secondary">뉴스·시장지표·공개 관심 신호를 연결해 확인할 포인트만 정리합니다.</p>
          </div>
          <TrackedLink href="/briefing" eventName="home_briefing_click" className="w-fit rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black hover:opacity-90">
            1분 브리핑 보기 →
          </TrackedLink>
        </div>
        <div className="grid md:grid-cols-3">
          {loadingNews ? (
            <div className="md:col-span-3"><NewsListSkeleton /></div>
          ) : news.slice(0, 3).map((item, index) => (
            <Link key={item.id} href={`/briefing#news-${item.id}`} className="border-b border-border/60 p-4 hover:bg-white/[0.03] md:border-b-0 md:border-r last:border-0">
              <div className="mb-2 flex items-center justify-between text-[10px] text-text-secondary">
                <span>0{index + 1} · {CATEGORY_LABELS[item.category] || item.category}</span>
                {typeof item.externalSearchInterest === 'number' && <span className="text-accent">분야관심 {Math.round(item.externalSearchInterest)}</span>}
              </div>
              <h2 className="line-clamp-2 text-sm font-semibold leading-6">{item.title}</h2>
              <p className="mt-2 text-[11px] text-accent-blue">영향과 다음 확인 지표 보기 →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 시장 지표 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary">실시간 시장지표</h2>
          <Link href="/market" className="text-xs text-accent-blue hover:underline">상세 →</Link>
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
                  {ind.changePercent === 0 ? '— 0.00%' : `${isUp ? '▲' : '▼'} ${Math.abs(ind.changePercent).toFixed(2)}%`}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </section>

      {/* 메인 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* 뉴스 */}
        <section className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold">🔥 인기 경제뉴스</h2>
              <p className="mt-0.5 text-[10px] text-text-secondary">내부 반응·원문 공개 반응·검색 관심도와 최신성 반영</p>
            </div>
            <Link href="/forum" className="text-xs text-accent-blue hover:underline">인기 탭 →</Link>
          </div>
          <div className="divide-y divide-border/50">
            {news.slice(0, 10).map((item, idx) => (
              <Link key={item.id} href={`/forum/news/${item.id}`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#1c2129] transition">
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
                  <div className="mt-1 mb-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-text-secondary">
                    <span>{item.sourceName}</span>
                    <span>·</span>
                    <span>{CATEGORY_LABELS[item.category] || item.category}</span>
                  </div>
                  <EngagementMetrics article={item} compact />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 사이드바 */}
        <aside className="space-y-4">
          {/* 빠른 액세스 */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="text-sm font-bold">도구</h3>
            </div>
            <div className="p-3 space-y-1">
              <Link href="/market" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#1f6feb]/20 flex items-center justify-center text-lg">📊</div>
                <div>
                  <div className="text-sm font-medium">시장 예측</div>
                  <div className="text-[11px] text-text-secondary">AI 기반 흐름 분석</div>
                </div>
              </Link>
              <Link href="/calendar" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#d29922]/20 flex items-center justify-center text-lg">📅</div>
                <div>
                  <div className="text-sm font-medium">경제 캘린더</div>
                  <div className="text-[11px] text-text-secondary">FOMC, 금통위, 실적</div>
                </div>
              </Link>
              <Link href="/tools" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-lg">💱</div>
                <div>
                  <div className="text-sm font-medium">투자 도구</div>
                  <div className="text-[11px] text-text-secondary">환율·세금 계산기</div>
                </div>
              </Link>
              <Link href="/search" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#f85149]/20 flex items-center justify-center text-lg">🔍</div>
                <div>
                  <div className="text-sm font-medium">종목 검색</div>
                  <div className="text-[11px] text-text-secondary">주식 정보 조회</div>
                </div>
              </Link>
              <Link href="/guides" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#58a6ff]/20 flex items-center justify-center text-lg">📘</div>
                <div>
                  <div className="text-sm font-medium">금융 가이드</div>
                  <div className="text-[11px] text-text-secondary">환율·금리·배당을 숫자로 이해</div>
                </div>
              </Link>
              <Link href="/dividend" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#1c2129] transition">
                <div className="w-8 h-8 rounded-lg bg-[#a371f7]/20 flex items-center justify-center text-lg">💰</div>
                <div>
                  <div className="text-sm font-medium">배당 관리</div>
                  <div className="text-[11px] text-text-secondary">포트폴리오 배당 캘린더</div>
                </div>
              </Link>
            </div>
          </div>

          {/* 간단 공지 */}
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-text-secondary leading-relaxed">
              💡 <span className="text-text-primary font-medium">InvestBoard</span>은 투자 정보 제공 플랫폼입니다.
              모든 투자 판단의 책임은 사용자에게 있습니다.
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
