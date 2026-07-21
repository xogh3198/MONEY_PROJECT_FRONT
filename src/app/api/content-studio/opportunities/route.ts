import { NextRequest, NextResponse } from 'next/server';
import {
  buildContentOpportunities,
  MarketIndicatorInput,
  NewsArticleInput,
} from '@/lib/content-studio';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.124.149.70:8083';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  try {
    const [hotResponse, latestResponse, indicatorResponse] = await Promise.all([
      fetch(`${NEWS_API}/api/news/hot`, { cache: 'no-store' }),
      fetch(`${NEWS_API}/api/news?page=0&size=80&sort=publishedAt,desc`, { cache: 'no-store' }),
      fetch(`${NEWS_API}/api/market/indicators`, { cache: 'no-store' }),
    ]);

    if (!hotResponse.ok || !latestResponse.ok || !indicatorResponse.ok) {
      throw new Error(
        `upstream status hot=${hotResponse.status}, latest=${latestResponse.status}, indicators=${indicatorResponse.status}`,
      );
    }

    const [hot, latestPage, indicators] = (await Promise.all([
      hotResponse.json(),
      latestResponse.json(),
      indicatorResponse.json(),
    ])) as [NewsArticleInput[], { content?: NewsArticleInput[] }, MarketIndicatorInput[]];

    const limit = Number(request.nextUrl.searchParams.get('limit') || 12);
    const opportunities = buildContentOpportunities(
      [...(hot || []), ...(latestPage?.content || [])],
      indicators || [],
      Number.isFinite(limit) ? limit : 12,
    );

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      methodology: '금융 관련성·48시간 최신성·내부 인기·참여·시장 연결성을 사용한 탐색 점수',
      opportunities,
    });
  } catch (error) {
    console.error('Content opportunity error:', error);
    return NextResponse.json({ error: '콘텐츠 후보 데이터를 불러오지 못했습니다.' }, { status: 502 });
  }
}

