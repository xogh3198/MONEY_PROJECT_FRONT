import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';

export const metadata: Metadata = {
  title: 'InvestBoard | ?�시�?경제 ?�스 & AI ?�장 ?�측',
  description: '코스?? 코스?? ?�율, 비트코인 ?�시�?지?��? AI ?�장 ?�측. 경제 ?�스 ?�럼?�서 ?�자?�들�??�장??분석?�세?? 배당�?캘린??& ISA ?�세 최적??',
  keywords: ['경제?�스', '코스??, '주식', '?�율', '비트코인', '배당�?, 'ISA', '?�자', '?�장?�측', 'AI분석'],
  openGraph: {
    title: 'InvestBoard | ?�시�?경제 ?�스 & AI ?�장 ?�측',
    description: '코스?�·환?�·비?�코???�시�?지?? AI ?�장 분석. 경제 ?�럼?�서 ?�자?�들�??�통?�세??',
    url: 'https://investboard.cloud',
    siteName: 'InvestBoard',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvestBoard | ?�시�?경제 ?�스 & AI ?�장 ?�측',
    description: '코스?�·환?�·비?�코???�시�?지?? AI ?�장 분석. ?�자?��? ?�한 종합 ?�랫??',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://investboard.cloud' },
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
