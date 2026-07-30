'use client';

import { track } from '@vercel/analytics/react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { trackGrowthEvent } from '@/lib/growth-analytics';

export default function TrackedLink({
  href,
  eventName,
  properties,
  className,
  children,
  target,
  rel,
}: {
  href: string;
  eventName: string;
  properties?: Record<string, string | number | boolean>;
  className?: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() => {
        track(eventName, { destination: href, ...properties });
        trackGrowthEvent(eventName, { destination: href, ...properties });
      }}
    >
      {children}
    </Link>
  );
}
