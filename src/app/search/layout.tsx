import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '금융 정보 검색',
  description: 'InvestingBoard 안에서 금융 뉴스와 시장 정보를 찾습니다.',
  alternates: { canonical: '/search' },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
