import { NextRequest, NextResponse } from 'next/server';

const NEWS_API = (process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.125.169.237:8083').replace(/\/+$/, '');

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') || '0');
  if (contentLength > 12_000) {
    return NextResponse.json({ error: '이벤트 데이터가 너무 큽니다.' }, { status: 413 });
  }

  try {
    const body = await request.json();
    const response = await fetch(`${NEWS_API}/api/analytics/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    return NextResponse.json({ recorded: response.ok }, { status: response.ok ? 202 : 400 });
  } catch {
    return NextResponse.json({ recorded: false }, { status: 202 });
  }
}
