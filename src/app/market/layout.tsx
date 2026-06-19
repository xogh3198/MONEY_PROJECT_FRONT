import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '시장지표 & AI 예측 - InvestBoard | 코스피 환율 비트코인',
  description: '코스피, 코스닥, 원달러 환율, S&P500, 비트코인 실시간 시세. AI 기반 시장 분석과 예측.',
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
