import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'InvestBoard | 실시간 경제뉴스와 커뮤니티',
    template: '%s | InvestBoard',
  },
  description: '국내증시, 해외증시, 환율, 금리, 암호화폐 뉴스를 내부 반응과 공개 관심 신호를 분리해 확인합니다.',
  alternates: { canonical: 'https://investboard.cloud/forum' },
  openGraph: {
    title: 'InvestBoard | 실시간 경제뉴스와 커뮤니티',
    description: '금융 뉴스, 공개 관심 신호와 사용자 토론을 한곳에서 확인합니다.',
    url: 'https://investboard.cloud/forum',
    siteName: 'InvestBoard',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
