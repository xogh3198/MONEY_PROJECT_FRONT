import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '경제 캘린더 - InvestBoard | FOMC 금통위 실적발표 일정',
  description: 'FOMC, 한국은행 금통위, 기업 실적발표, 배당락일 등 주요 경제 이벤트 일정.',
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
