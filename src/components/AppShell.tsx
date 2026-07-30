'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const usesCustomShell = pathname === '/'
    || pathname.startsWith('/promotion-map')
    || pathname.startsWith('/content-studio');

  if (usesCustomShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      <Footer />
    </>
  );
}
