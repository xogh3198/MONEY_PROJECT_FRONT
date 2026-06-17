'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchIndicators, fetchHotNews } from '@/lib/api';

interface Indicator {
  type: string;
  name: string;
  value: number;
  changePercent: number;
}

interface NewsItem {
  id: string;
  title: string;
  sourceName: string;
  publishedAt: string;
  commentCount: number;
  category: string;
}

export default function HomePage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    loadIndicators();
    loadNews();
  }, []);

  const loadIndicators = async () => {
    try {
      const data = await fetchIndicators();
      if (data && data.length > 0) setIndicators(data);
    } catch {
      // 백엔드 미연결 시 기본값 유지
    }
  };

  const loadNews = async () => {
    try {
      const data = await fetchHotNews();
      if (data && data.length > 0) {
        setNews(data.map((item: any) => ({
          id: item.id,
          title: item.title,
          sourceName: item.sourceName || '기타',
          publishedAt: formatTime(item.publishedAt),
          commentCount: item.commentCount || 0,
          category: item.category || '',
        })));
      }
    } catch {
      // 백엔드 미연결 시 시드 유지
    }
  };

  return (
    <div className="space-y-5">
      {/* 시장 지표 */}
      <section className="bg-white rounded border border-[#e4e4e4]">
        <div className="px-5 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
          <h2 className="text-[13px] font-bold text-[#333]">주요 시장지표</h2>
          <Link href="/market" className="text-[12px] text-[#999] hover:text-[#03c75a]">더보기</Link>
        </div>
        <div className="grid grid-cols-5 divide-x divide-[#f0f0f0]">
          {indicators.map(ind => (
            <div key={ind.type} className="px-4 py-4 text-center">
              <div className="text-[12px] text-[#888] mb-1">{ind.name}</div>
              <div className="text-[18px] font-bold text-[#333]">
                {ind.type === 'BTC' ? `$${ind.value.toLocaleString()}` : ind.value.toLocaleString()}
              </div>
              <div className={`text-[13px] font-medium mt-0.5 ${ind.changePercent >= 0 ? 'text-[#d63031]' : 'text-[#0984e3]'}`}>
                {ind.changePercent >= 0 ? '▲' : '▼'} {ind.changePercent >= 0 ? '+' : ''}{ind.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 뉴스 + 사이드바 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <section className="bg-white rounded border border-[#e4e4e4]">
          <div className="px-5 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
            <h2 className="text-[13px] font-bold text-[#333]">오늘의 경제뉴스</h2>
            <Link href="/forum" className="text-[12px] text-[#999] hover:text-[#03c75a]">전체보기</Link>
          </div>
          <ul>
            {news.map(item => (
              <li key={item.id} className="px-5 py-3 border-b border-[#f9f9f9] last:border-0 hover:bg-[#fafafa] cursor-pointer">
                <p className="text-[14px] text-[#333] font-medium leading-snug mb-1">{item.title}</p>
                <div className="flex items-center gap-2 text-[12px] text-[#999]">
                  <span>{item.sourceName}</span>
                  <span>·</span>
                  <span>{item.publishedAt}</span>
                  <span className="ml-auto">💬 {item.commentCount}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-5">
          <div className="bg-white rounded border border-[#e4e4e4]">
            <div className="px-4 py-3 border-b border-[#f0f0f0]">
              <h3 className="text-[13px] font-bold text-[#333]">투자 도구</h3>
            </div>
            <div className="p-4 space-y-3">
              <Link href="/market" className="flex items-center gap-3 p-3 rounded hover:bg-[#fafafa]">
                <span className="text-xl">📊</span>
                <div>
                  <div className="text-sm font-medium">시장 예측</div>
                  <div className="text-xs text-[#999]">AI 기반 흐름 분석</div>
                </div>
              </Link>
              <Link href="/dividend" className="flex items-center gap-3 p-3 rounded hover:bg-[#fafafa]">
                <span className="text-xl">💰</span>
                <div>
                  <div className="text-sm font-medium">배당 캘린더</div>
                  <div className="text-xs text-[#999]">포트폴리오 배당 관리</div>
                </div>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatTime(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return '방금';
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}
