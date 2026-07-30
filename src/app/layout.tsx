import './globals.css';
import '@/styles/promotion-map.css';
import '@/styles/investboard-hub.css';
import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import { Analytics } from '@vercel/analytics/react';
import PageViewTracker from '@/components/analytics/PageViewTracker';

export const metadata: Metadata = {
  metadataBase: new URL('https://investboard.cloud'),
  title: { default: 'InvestBoard | 정보에서 실행까지', template: '%s | InvestBoard' },
  description: '금융 뉴스·토론 InvestingBoard와 홍보 계획·영상 제작 마케팅맵을 한곳에서 이용하세요.',
  keywords: ['금융 뉴스', '투자 커뮤니티', '홍보 계획', '마케팅 채널', '홍보 영상', 'AI 영상'],
  authors: [{ name: 'InvestBoard', url: 'https://investboard.cloud' }],
  creator: 'InvestBoard',
  publisher: 'InvestBoard',
  openGraph: {
    title: 'InvestBoard | 정보에서 실행까지',
    description: '금융 이슈를 읽고 토론하거나, 내 서비스의 홍보 경로와 영상을 설계하세요.',
    url: 'https://investboard.cloud',
    siteName: 'InvestBoard',
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: 'InvestBoard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvestBoard | 정보에서 실행까지',
    description: '금융 뉴스·토론과 홍보 계획·영상 제작을 목적에 따라 이용하세요.',
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
        <PageViewTracker />
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
