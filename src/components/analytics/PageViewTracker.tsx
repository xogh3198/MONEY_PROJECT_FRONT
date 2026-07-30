'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { trackGrowthEvent } from '@/lib/growth-analytics';

export default function PageViewTracker() {
  const pathname = usePathname();
  const previous = useRef('');

  useEffect(() => {
    const key = `${pathname}${window.location.search}`;
    if (previous.current === key) return;
    previous.current = key;
    trackGrowthEvent('page_view', {
      referrer_host: safeReferrerHost(document.referrer),
    });
  }, [pathname]);

  return null;
}

function safeReferrerHost(referrer: string): string {
  if (!referrer) return 'direct';
  try {
    return new URL(referrer).hostname.slice(0, 120);
  } catch {
    return 'unknown';
  }
}
