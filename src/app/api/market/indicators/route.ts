import { NextResponse } from 'next/server';
import { NEWS_API_BASE, requireApiBase } from '@/lib/server/api-base';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const newsApi = requireApiBase(NEWS_API_BASE, 'NEWS_API_URL');
    const res = await fetch(`${newsApi}/api/market/indicators`, {
      cache: 'no-store', // 실시간 — 캐시 없음
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: '시장 지표 서버가 요청을 처리하지 못했습니다.' },
        { status: res.status },
      );
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ error: '사용 가능한 시장 지표가 없습니다.' }, { status: 503 });
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '시장 지표 서버에 연결하지 못했습니다.' },
      { status: 503 },
    );
  }
}
