import { NextRequest, NextResponse } from 'next/server';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.124.149.70:8083';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  try {
    const response = await fetch(`${NEWS_API}/api/operations/status`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      throw new Error(`operations status ${response.status}`);
    }
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Content studio operations status error:', error);
    return NextResponse.json({ error: '운영 상태를 불러오지 못했습니다.' }, { status: 502 });
  }
}
