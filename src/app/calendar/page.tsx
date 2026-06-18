'use client';
import { useState } from 'react';

interface EconomicEvent {
  date: string;
  time: string;
  title: string;
  country: string;
  importance: 'high' | 'medium' | 'low';
  category: string;
}

const EVENTS: EconomicEvent[] = [
  { date: '2026-06-18', time: '09:00', title: '한국 금통위 의사록 공개', country: '🇰🇷', importance: 'high', category: '금리' },
  { date: '2026-06-19', time: '21:30', title: '미국 주간 실업수당 청구건수', country: '🇺🇸', importance: 'medium', category: '고용' },
  { date: '2026-06-20', time: '08:00', title: '한국 생산자물가지수 (5월)', country: '🇰🇷', importance: 'medium', category: '물가' },
  { date: '2026-06-24', time: '15:00', title: '독일 IFO 기업환경지수', country: '🇩🇪', importance: 'medium', category: '경기' },
  { date: '2026-06-25', time: '09:00', title: '삼성전자 배당락일', country: '🇰🇷', importance: 'high', category: '배당' },
  { date: '2026-06-25', time: '09:00', title: 'SK하이닉스 배당락일', country: '🇰🇷', importance: 'high', category: '배당' },
  { date: '2026-06-26', time: '21:30', title: '미국 PCE 물가지수 (5월)', country: '🇺🇸', importance: 'high', category: '물가' },
  { date: '2026-06-26', time: '21:30', title: '미국 GDP 확정치 (1Q)', country: '🇺🇸', importance: 'high', category: '경기' },
  { date: '2026-06-27', time: '08:00', title: '한국 소비자심리지수 (6월)', country: '🇰🇷', importance: 'low', category: '경기' },
  { date: '2026-07-02', time: '03:00', title: 'FOMC 의사록 공개', country: '🇺🇸', importance: 'high', category: '금리' },
  { date: '2026-07-03', time: '21:30', title: '미국 비농업 고용 (6월)', country: '🇺🇸', importance: 'high', category: '고용' },
  { date: '2026-07-10', time: '09:00', title: '한국 금통위 기준금리 결정', country: '🇰🇷', importance: 'high', category: '금리' },
  { date: '2026-07-15', time: '삼성전자', title: '삼성전자 2Q 잠정실적 발표', country: '🇰🇷', importance: 'high', category: '실적' },
  { date: '2026-07-30', time: '03:00', title: 'FOMC 금리 결정', country: '🇺🇸', importance: 'high', category: '금리' },
];

export default function CalendarPage() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? EVENTS : EVENTS.filter(e => e.category === filter);
  const categories = ['all', '금리', '물가', '고용', '경기', '배당', '실적'];

  // 날짜별 그룹핑
  const grouped = filtered.reduce<Record<string, EconomicEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">📅 경제 캘린더</h1>
        <p className="text-xs text-text-secondary mt-1">주요 경제 이벤트와 배당락일 일정</p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition ${
              filter === cat ? 'bg-accent text-black' : 'bg-card border border-border text-text-secondary hover:text-text-primary'
            }`}>
            {cat === 'all' ? '전체' : cat}
          </button>
        ))}
      </div>

      {/* 이벤트 타임라인 */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([date, events]) => {
          const d = new Date(date);
          const isToday = new Date().toDateString() === d.toDateString();
          const dayName = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];

          return (
            <div key={date} className="bg-card rounded-lg border border-border overflow-hidden">
              <div className={`px-4 py-2 border-b border-border flex items-center gap-2 ${isToday ? 'bg-accent/10' : ''}`}>
                <span className={`text-sm font-bold ${isToday ? 'text-accent' : 'text-text-primary'}`}>
                  {date.substring(5)} ({dayName})
                </span>
                {isToday && <span className="text-[10px] px-2 py-0.5 bg-accent text-black rounded font-medium">오늘</span>}
              </div>
              <div className="divide-y divide-border/30">
                {events.map((event, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      event.importance === 'high' ? 'bg-[#f85149]' :
                      event.importance === 'medium' ? 'bg-[#d29922]' : 'bg-text-secondary'
                    }`} />
                    <span className="text-lg">{event.country}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-text-primary">{event.title}</p>
                      <span className="text-[11px] text-text-secondary">{event.time}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-border/50 text-text-secondary">{event.category}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-text-secondary mt-8">
        ※ 일정은 변경될 수 있습니다. 공식 발표를 확인하세요.
      </p>
    </div>
  );
}
