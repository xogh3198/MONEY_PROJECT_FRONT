import { NextRequest, NextResponse } from 'next/server';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;
  const { jobId } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(jobId)) {
    return NextResponse.json({ error: '잘못된 AI 장면 작업 번호입니다.' }, { status: 400 });
  }

  try {
    const response = await fetchVideoRenderApi(`/api/content-videos/ai-assets/${jobId}/file`, {
      signal: AbortSignal.timeout(60_000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: await readApiError(response, `AI 장면 파일 조회 실패 (${response.status})`) },
        { status: response.status },
      );
    }
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp4',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI 장면 파일을 불러오지 못했습니다.' },
      { status: 502 },
    );
  }
}
