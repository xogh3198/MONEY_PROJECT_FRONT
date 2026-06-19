'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setError('?�증 코드�?받�? 못했?�니??');
      return;
    }

    // 카카???�큰 교환
    fetch('/api/auth-kakao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          // 로그???�공
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data));
          window.location.href = '/';
        }
      })
      .catch(() => {
        setError('카카??로그??처리 �??�류가 발생?�습?�다.');
      });
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-negative mb-4">{error}</p>
          <a href="/login" className="text-accent hover:underline">로그???�이지�??�아가�?/a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-text-secondary">카카??로그??처리 �?..</p>
      </div>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary">로딩 �?..</p>
        </div>
      </div>
    }>
      <KakaoCallbackContent />
    </Suspense>
  );
}