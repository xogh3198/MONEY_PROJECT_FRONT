import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://investboard.cloud'),
  title: { default: 'InvestBoard | 오늘 내 돈에 영향을 주는 금융 데이터', template: '%s | InvestBoard' },
  description: '인기 금융 이슈를 시장지표, 공개 관심 신호, 계산 도구와 연결해 1분 안에 설명합니다.',
  keywords: ['경제뉴스', '코스피', '주식', '환율', '금리', '배당금', '금융 데이터', '시장 브리핑'],
  authors: [{ name: 'InvestBoard 편집팀', url: 'https://investboard.cloud/guides' }],
  creator: 'InvestBoard',
  publisher: 'InvestBoard',
  alternates: { types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: {
    title: 'InvestBoard | 오늘 내 돈에 영향을 주는 금융 데이터',
    description: '인기 금융 이슈를 시장지표와 계산 도구로 이해하는 1분 브리핑.',
    url: 'https://investboard.cloud',
    siteName: 'InvestBoard',
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'InvestBoard 금융 데이터 브리핑' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvestBoard | 오늘 내 돈에 영향을 주는 금융 데이터',
    description: '인기 금융 이슈를 시장지표와 계산 도구로 이해하는 1분 브리핑.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
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
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
