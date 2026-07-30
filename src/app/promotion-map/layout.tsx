import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: '마케팅맵 | 홍보의 다음 한 걸음을 선명하게' },
  description: 'URL, 상품, 매장, 앱, 소개글에서 실행 가능한 홍보 계획과 검수형 AI 영상 초안을 만듭니다.',
  alternates: { canonical: 'https://investboard.cloud/promotion-map' },
  openGraph: {
    title: '마케팅맵 | 홍보의 다음 한 걸음을 선명하게',
    description: '홍보할 대상을 입력하면 채널, 비용, 이번 주 행동과 영상 초안을 한 흐름으로 정리합니다.',
    url: 'https://investboard.cloud/promotion-map',
    siteName: '마케팅맵',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function PromotionMapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
