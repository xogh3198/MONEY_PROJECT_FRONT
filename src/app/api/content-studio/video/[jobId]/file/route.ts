import { NextRequest, NextResponse } from 'next/server';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ jobId: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  try {
    const { jobId } = await params;
    if (!/^[0-9a-f-]{36}$/i.test(jobId)) {
      return NextResponse.json({ error: '잘못된 영상 작업 ID입니다.' }, { status: 400 });
    }
    const response = await fetchVideoRenderApi(`/api/content-videos/${jobId}/file`, {
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok || !response.body) {
      return NextResponse.json(
        { error: await readApiError(response, `영상 파일 조회 실패 (${response.status})`) },
        { status: response.status },
      );
    }
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp4',
        'Content-Disposition': response.headers.get('content-disposition') || 'inline; filename="investboard.mp4"',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Content studio video file error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '영상 파일을 불러오지 못했습니다.' },
      { status: 502 },
    );
  }
}
