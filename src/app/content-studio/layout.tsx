import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Studio | InvestBoard',
  robots: { index: false, follow: false },
};

export default function ContentStudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}

