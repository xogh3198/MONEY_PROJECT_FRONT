import { NextRequest, NextResponse } from 'next/server';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  try {
    const response = await fetchVideoRenderApi('/api/content-videos/capabilities', {
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: await readApiError(response, `영상 기능 조회 실패 (${response.status})`) },
        { status: response.status },
      );
    }
    return NextResponse.json(await response.json());
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '영상 기능 상태를 확인하지 못했습니다.' },
      { status: 502 },
    );
  }
}
