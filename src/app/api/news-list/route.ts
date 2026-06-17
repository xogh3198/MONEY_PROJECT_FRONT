import { NextRequest, NextResponse } from 'next/server';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://15.164.171.43:8083';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams.toString();
  try {
    const res = await fetch(`${NEWS_API}/api/news?${searchParams}`, { next: { revalidate: 60 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ content: [], totalElements: 0 });
  }
}
