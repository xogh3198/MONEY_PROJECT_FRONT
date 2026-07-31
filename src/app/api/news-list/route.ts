import { NextRequest, NextResponse } from 'next/server';
import { NEWS_API_BASE, requireApiBase } from '@/lib/server/api-base';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  try {
    const newsApi = requireApiBase(NEWS_API_BASE, 'NEWS_API_URL');
    const res = await fetch(`${newsApi}/api/news?${searchParams}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: '뉴스 목록 서버가 요청을 처리하지 못했습니다.' },
        { status: res.status },
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '뉴스 목록 서버에 연결하지 못했습니다.' },
      { status: 503 },
    );
  }
}
