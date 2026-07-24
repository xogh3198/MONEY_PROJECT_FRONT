import { NextRequest, NextResponse } from 'next/server';
import type { NewsArticle } from '@/lib/news';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.124.149.70:8083';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  const hotUrl = category
    ? `${NEWS_API}/api/news/hot?category=${category}`
    : `${NEWS_API}/api/news/hot`;

  try {
    const hotResponse = await fetch(hotUrl, { next: { revalidate: 60 } });
    const hot: NewsArticle[] = hotResponse.ok ? await hotResponse.json() : [];
    return NextResponse.json(hot.slice(0, 10));
  } catch {
    return NextResponse.json([]);
  }
}
