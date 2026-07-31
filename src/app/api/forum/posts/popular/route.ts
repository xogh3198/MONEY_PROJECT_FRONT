import { NextRequest, NextResponse } from 'next/server';
import { NEWS_API_BASE, requireApiBase } from '@/lib/server/api-base';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const params = searchParams.toString();
  try {
    const newsApi = requireApiBase(NEWS_API_BASE, 'NEWS_API_URL');
    const res = await fetch(`${newsApi}/api/forum/posts/popular${params ? `?${params}` : ''}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '서버 연결 실패' }, { status: 503 });
  }
}
