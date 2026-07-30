import './globals.css';
import '@/styles/promotion-map.css';
import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  metadataBase: new URL('https://investboard.cloud'),
  title: { default: '홍보지도 | 홍보의 다음 한 걸음을 선명하게', template: '%s | 홍보지도' },
  description: 'URL, 상품, 매장, 앱, 소개글에서 실행 가능한 홍보 계획과 검수형 AI 영상 초안을 만듭니다.',
  keywords: ['홍보 계획', '마케팅 채널', '홍보 영상', 'AI 영상', '소상공인 마케팅', '콘텐츠 마케팅'],
  authors: [{ name: '홍보지도 팀', url: 'https://investboard.cloud' }],
  creator: '홍보지도',
  publisher: '홍보지도',
  openGraph: {
    title: '홍보지도 | 홍보의 다음 한 걸음을 선명하게',
    description: '홍보할 대상을 입력하면 채널, 비용, 이번 주 행동과 영상 초안을 한 흐름으로 정리합니다.',
    url: 'https://investboard.cloud',
    siteName: '홍보지도',
    type: 'website',
    locale: 'ko_KR',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630, alt: '홍보지도' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '홍보지도 | 홍보의 다음 한 걸음을 선명하게',
    description: '홍보 계획과 검수형 AI 영상 초안을 한 흐름으로 만듭니다.',
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
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
