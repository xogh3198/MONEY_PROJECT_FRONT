import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'InvestingBoard | 금융 뉴스·시장 데이터·투자 커뮤니티',
    template: '%s | InvestingBoard',
  },
  description:
    '국내증시, 해외증시, 환율, 금리, 암호화폐 뉴스를 확인하고 공개 관심 신호와 InvestBoard 사용자 반응을 구분해 토론하세요.',
  alternates: { canonical: 'https://investboard.cloud/forum' },
  openGraph: {
    title: 'InvestingBoard | 금융 뉴스·시장 데이터·투자 커뮤니티',
    description: '금융 뉴스와 시장 데이터, 공개 관심 신호, 사용자 토론을 한곳에서 확인합니다.',
    url: 'https://investboard.cloud/forum',
    siteName: 'InvestBoard',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
