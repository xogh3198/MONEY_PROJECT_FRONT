import { NextRequest, NextResponse } from 'next/server';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://15.164.171.43:8083';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'KOSPI';
  const days = request.nextUrl.searchParams.get('days') || '30';

  try {
    const res = await fetch(`${NEWS_API}/api/market/indicators/${type}/history?days=${days}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
