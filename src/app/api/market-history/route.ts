import { NextRequest, NextResponse } from 'next/server';
import { NEWS_API_BASE, requireApiBase } from '@/lib/server/api-base';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'KOSPI';
  const days = request.nextUrl.searchParams.get('days') || '30';
  const interval = request.nextUrl.searchParams.get('interval') || '1d';

  try {
    const newsApi = requireApiBase(NEWS_API_BASE, 'NEWS_API_URL');
    const res = await fetch(`${newsApi}/api/market/indicators/${type}/history?days=${days}&interval=${interval}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: '시장 차트 서버가 요청을 처리하지 못했습니다.' },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '시장 차트 서버에 연결하지 못했습니다.' },
      { status: 503 },
    );
  }
}
