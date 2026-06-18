import { NextResponse } from 'next/server';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://15.164.171.43:8083';

export async function GET() {
  try {
    const res = await fetch(`${NEWS_API}/api/market/indicators`, {
      next: { revalidate: 30 }, // 30초 캐시
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([
      { type: 'KOSPI', name: '코스피', value: 0, changePercent: 0, prediction: 'NEUTRAL', updatedAt: 'error' },
    ], { status: 200 });
  }
}
