import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '실시간 경제뉴스와 관심 신호',
  description: '국내증시, 해외증시, 환율, 금리, 암호화폐 뉴스를 내부 반응과 공개 관심 신호를 분리해 확인합니다.',
  alternates: { canonical: 'https://investboard.cloud/forum' },
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
