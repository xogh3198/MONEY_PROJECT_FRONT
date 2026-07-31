import { NextRequest, NextResponse } from 'next/server';
import type { NewsArticle } from '@/lib/news';
import { NEWS_API_BASE, requireApiBase } from '@/lib/server/api-base';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');

  try {
    const newsApi = requireApiBase(NEWS_API_BASE, 'NEWS_API_URL');
    const hotUrl = category
      ? `${newsApi}/api/news/hot?category=${category}`
      : `${newsApi}/api/news/hot`;
    const hotResponse = await fetch(hotUrl, { next: { revalidate: 60 } });
    if (!hotResponse.ok) {
      return NextResponse.json(
        { error: '인기 뉴스 서버가 요청을 처리하지 못했습니다.' },
        { status: hotResponse.status },
      );
    }
    const hot: NewsArticle[] = await hotResponse.json();
    return NextResponse.json(hot.slice(0, 10));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '인기 뉴스 서버에 연결하지 못했습니다.' },
      { status: 503 },
    );
  }
}
