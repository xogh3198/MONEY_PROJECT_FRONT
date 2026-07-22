import { NextRequest, NextResponse } from 'next/server';
import type { NewsArticle } from '@/lib/news';
import { rankNewsForBriefing } from '@/lib/news-ranking';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.124.149.70:8083';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  const hotUrl = category
    ? `${NEWS_API}/api/news/hot?category=${category}`
    : `${NEWS_API}/api/news/hot`;
  const recentParams = new URLSearchParams({ page: '0', size: '50', sort: 'publishedAt,desc' });
  if (category) recentParams.set('category', category);

  try {
    const [hotResponse, recentResponse] = await Promise.all([
      fetch(hotUrl, { next: { revalidate: 60 } }),
      fetch(`${NEWS_API}/api/news?${recentParams}`, { next: { revalidate: 60 } }),
    ]);
    const hot: NewsArticle[] = hotResponse.ok ? await hotResponse.json() : [];
    const recentPayload = recentResponse.ok ? await recentResponse.json() : {};
    const recent: NewsArticle[] = Array.isArray(recentPayload?.content) ? recentPayload.content : [];
    return NextResponse.json(rankNewsForBriefing([...hot, ...recent], 10));
  } catch {
    return NextResponse.json([]);
  }
}
