import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: '마케팅맵 | URL로 만드는 홍보 계획·AI 영상' },
  description:
    'URL, 상품, 매장, 앱, 소개글을 입력하면 적합한 홍보 채널과 비용, 이번 주 실행 계획, 검수 가능한 AI 영상 초안을 만듭니다.',
  alternates: { canonical: 'https://investboard.cloud/promotion-map' },
  openGraph: {
    title: '마케팅맵 | URL로 만드는 홍보 계획·AI 영상',
    description: '홍보할 대상을 입력하면 채널, 비용, 이번 주 행동과 영상 초안을 한 흐름으로 정리합니다.',
    url: 'https://investboard.cloud/promotion-map',
    siteName: 'InvestBoard',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function PromotionMapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
