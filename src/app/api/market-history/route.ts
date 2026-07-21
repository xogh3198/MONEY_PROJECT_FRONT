import { NextRequest, NextResponse } from 'next/server';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.124.149.70:8083';

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || 'KOSPI';
  const days = request.nextUrl.searchParams.get('days') || '30';
  const interval = request.nextUrl.searchParams.get('interval') || '1d';

  try {
    const res = await fetch(`${NEWS_API}/api/market/indicators/${type}/history?days=${days}&interval=${interval}`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
