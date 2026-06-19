import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '경제뉴스 - InvestBoard | 실시간 경제 뉴스 & 투자 포럼',
  description: '국내증시, 해외증시, 환율, 금리, 암호화폐 실시간 뉴스. 투자자들의 시장 전망과 토론.',
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
