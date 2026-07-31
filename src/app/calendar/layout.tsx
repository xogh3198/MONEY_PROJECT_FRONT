import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '경제 캘린더 연동 준비 안내',
  description: '공식 경제 일정 API와 출처 검증을 준비 중입니다.',
  alternates: { canonical: 'https://investboard.cloud/calendar' },
  robots: { index: false, follow: true },
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
