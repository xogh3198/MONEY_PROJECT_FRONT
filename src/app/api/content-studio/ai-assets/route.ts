import { NextRequest, NextResponse } from 'next/server';
import { AiSceneGenerationJob, ContentScene } from '@/lib/content-studio';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json() as {
      experimentId?: string;
      scene?: ContentScene;
      stylePrompt?: string;
    };
    if (!body.experimentId || !body.scene?.order || !body.scene.onScreenText) {
      return NextResponse.json({ error: 'AI로 만들 장면 정보가 필요합니다.' }, { status: 400 });
    }
    const response = await fetchVideoRenderApi('/api/content-videos/ai-assets', {
      method: 'POST',
      body: JSON.stringify({
        experimentId: body.experimentId,
        sceneOrder: body.scene.order,
        onScreenText: body.scene.onScreenText,
        visualDirection: body.scene.visualDirection,
        visualSearchTerms: body.scene.visualSearchTerms,
        stylePrompt: body.stylePrompt || '',
      }),
      signal: AbortSignal.timeout(40_000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: await readApiError(response, `AI 장면 작업 생성 실패 (${response.status})`) },
        { status: response.status },
      );
    }
    return NextResponse.json(await response.json() as AiSceneGenerationJob, { status: 202 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI 장면 작업을 시작하지 못했습니다.' },
      { status: 502 },
    );
  }
}
