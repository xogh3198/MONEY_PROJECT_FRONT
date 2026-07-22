'use client';

import { track } from '@vercel/analytics/react';
import { useState } from 'react';

export default function ShareButton({
  title,
  path,
  contentType,
}: {
  title: string;
  path: string;
  contentType: string;
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = new URL(path, window.location.origin);
    url.searchParams.set('utm_source', 'share');
    url.searchParams.set('utm_medium', 'organic');
    url.searchParams.set('utm_campaign', contentType);
    try {
      if (navigator.share) {
        await navigator.share({ title, url: url.toString() });
        track('content_share', { content_type: contentType, method: 'native' });
      } else {
        await navigator.clipboard.writeText(url.toString());
        setCopied(true);
        track('content_share', { content_type: contentType, method: 'clipboard' });
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // 사용자가 공유 창을 닫은 경우에는 실패 메시지를 띄우지 않습니다.
    }
  };

  return (
    <button onClick={() => void share()} className="rounded-lg border border-border px-3 py-2 text-xs text-text-secondary hover:text-text-primary">
      {copied ? '링크 복사됨' : '공유하기'}
    </button>
  );
}
