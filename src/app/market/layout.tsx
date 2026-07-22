import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시장지표와 정보형 흐름 분석',
  description: '코스피, 코스닥, 원달러 환율, S&P500, 비트코인, 금 지표와 정보형 시장 분석을 확인합니다.',
  alternates: { canonical: 'https://investboard.cloud/market' },
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
