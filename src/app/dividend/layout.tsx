import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '배당 포트폴리오 관리',
  description: '보유 종목의 예상 배당금과 지급 일정을 한곳에서 관리합니다.',
  alternates: { canonical: 'https://investboard.cloud/dividend' },
};

export default function DividendLayout({ children }: { children: React.ReactNode }) {
  return children;
}
