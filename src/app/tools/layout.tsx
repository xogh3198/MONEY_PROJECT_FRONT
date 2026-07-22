import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '환율·배당 계산 도구',
  description: '현재 환율 환산과 계좌 유형별 배당 현금흐름을 빠르게 비교하는 무료 계산 도구입니다.',
  alternates: { canonical: 'https://investboard.cloud/tools' },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
