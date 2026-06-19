import { NextRequest, NextResponse } from 'next/server';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://15.164.171.43:8083';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = searchParams.toString();
  try {
    const res = await fetch(`${NEWS_API}/api/forum/posts/popular${params ? `?${params}` : ''}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '서버 연결 실패' }, { status: 503 });
  }
}
