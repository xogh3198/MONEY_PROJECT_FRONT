'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function NaverCallbackContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      setError('?¸ì¦ ì½”ë“œë¥?ë°›ì? ëª»í–ˆ?µë‹ˆ??');
      return;
    }

    // ?¤ì´ë²?? í° êµí™˜
    fetch('/api/auth-naver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          try { const json = JSON.parse(text); setError(json.error || `?œë²„ ?¤ë¥˜ (${res.status})`); }
          catch { setError(`?œë²„ ?¤ë¥˜ (${res.status}): ${text.slice(0, 100)}`); }
          return;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        if (data.error) {
          setError(data.error);
        } else {
          // ë¡œê·¸???±ê³µ
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          window.location.href = '/';
        }
      })
      .catch((e) => {
        setError('?¤ì´ë²?ë¡œê·¸??ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤: ' + (e?.message || ''));
      });
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-negative mb-4">{error}</p>
          <a href="/login" className="text-accent hover:underline">ë¡œê·¸???˜ì´ì§€ë¡??Œì•„ê°€ê¸?/a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-text-secondary">?¤ì´ë²?ë¡œê·¸??ì²˜ë¦¬ ì¤?..</p>
      </div>
    </div>
  );
}

export default function NaverCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary">ë¡œë”© ì¤?..</p>
        </div>
      </div>
    }>
      <NaverCallbackContent />
    </Suspense>
  );
}