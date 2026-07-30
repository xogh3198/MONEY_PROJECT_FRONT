import { NextRequest, NextResponse } from 'next/server';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  const days = Math.max(1, Math.min(Number(request.nextUrl.searchParams.get('days') || '30'), 90));
  try {
    const response = await fetchVideoRenderApi(`/api/analytics/summary?days=${days}`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: await readApiError(response, '운영 지표를 불러오지 못했습니다.') },
        { status: response.status },
      );
    }
    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '운영 지표를 불러오지 못했습니다.' },
      { status: 502 },
    );
  }
}
