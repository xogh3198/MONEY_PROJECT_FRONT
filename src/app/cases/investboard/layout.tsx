import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'InvestBoard 운영 사례 | 홍보지도' },
  description: '금융 관심 신호에서 뉴스 포럼과 검수형 홍보 영상으로 이어지는 홍보지도의 실제 운영 사례입니다.',
  alternates: { canonical: 'https://investboard.cloud/cases/investboard' },
  openGraph: {
    title: 'InvestBoard 운영 사례 | 홍보지도',
    description: '관심 신호를 발견하고, 설명할 주제를 고르고, 포럼과 영상으로 연결하는 실제 운영 구조를 공개합니다.',
    url: 'https://investboard.cloud/cases/investboard',
    siteName: '홍보지도',
    type: 'article',
    locale: 'ko_KR',
  },
};

export default function InvestBoardCaseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
