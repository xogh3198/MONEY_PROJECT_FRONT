'use client';

import { track } from '@vercel/analytics/react';
import { useEffect, useRef } from 'react';

export default function GrowthTracker({ contentType, contentId }: { contentType: string; contentId: string }) {
  const sent = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (sent.current) return;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight <= 0 || window.scrollY / documentHeight >= 0.5) {
        sent.current = true;
        track('qualified_read_50', { content_type: contentType, content_id: contentId });
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [contentId, contentType]);

  return null;
}
