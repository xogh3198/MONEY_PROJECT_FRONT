import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'MoneyForum | 실시간 경제 뉴스 & AI 시장 예측',
  description: '코스피, 코스닥, 환율, 비트코인 실시간 지표와 AI 시장 예측. 경제 뉴스 포럼에서 투자자들과 시장을 분석하세요. 배당금 캘린더 & ISA 절세 최적화.',
  keywords: ['경제뉴스', '코스피', '주식', '환율', '비트코인', '배당금', 'ISA', '투자', '시장예측', 'AI분석'],
  openGraph: {
    title: 'MoneyForum | 실시간 경제 뉴스 & AI 시장 예측',
    description: '코스피·환율·비트코인 실시간 지표. AI 시장 분석. 경제 포럼에서 투자자들과 소통하세요.',
    url: 'https://money-project-five.vercel.app',
    siteName: 'MoneyForum',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoneyForum | 실시간 경제 뉴스 & AI 시장 예측',
    description: '코스피·환율·비트코인 실시간 지표. AI 시장 분석. 투자자를 위한 종합 플랫폼.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://money-project-five.vercel.app' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet" />
      </head>
      <body>
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 py-6 pb-20 md:pb-6">
          {children}
        </main>
      </body>
    </html>
  );
}
