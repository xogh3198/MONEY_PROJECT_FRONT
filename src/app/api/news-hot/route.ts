import { NextRequest, NextResponse } from 'next/server';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://15.164.171.43:8083';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');
  const url = category
    ? `${NEWS_API}/api/news/hot?category=${category}`
    : `${NEWS_API}/api/news/hot`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
