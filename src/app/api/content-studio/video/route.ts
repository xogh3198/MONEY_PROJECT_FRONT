import { NextRequest, NextResponse } from 'next/server';
import {
  ContentScriptDraft,
  VideoRenderQuality,
  VideoVoiceStyle,
} from '@/lib/content-studio';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json() as {
      draft?: ContentScriptDraft;
      quality?: VideoRenderQuality;
      voiceStyle?: VideoVoiceStyle;
      voiceProvider?: string;
      voiceId?: string;
      sceneAssets?: Record<string, string>;
    };
    const draft = body.draft;
    const quality = body.quality === 'FINAL' ? 'FINAL' : 'PREVIEW';
    const voiceStyle: VideoVoiceStyle = ['WHISPER', 'SNARKY'].includes(body.voiceStyle || '')
      ? body.voiceStyle as VideoVoiceStyle
      : 'NATURAL';
    if (!draft?.experimentId || !draft.title || draft.scenes?.length !== 7) {
      return NextResponse.json({ error: '검수할 7장면 대본이 필요합니다.' }, { status: 400 });
    }

    const response = await fetchVideoRenderApi('/api/content-videos/render', {
      method: 'POST',
      body: JSON.stringify({
        experimentId: draft.experimentId,
        title: draft.title,
        scenes: draft.scenes.map(scene => ({
          order: scene.order,
          narration: scene.narration,
          onScreenText: scene.onScreenText,
          visualDirection: scene.visualDirection,
          visualSearchTerms: scene.visualSearchTerms,
          assetRef: body.sceneAssets?.[String(scene.order)] || null,
        })),
        disclaimer: draft.disclaimer,
        aiDisclosure: draft.aiDisclosure,
        voiceProvider: body.voiceProvider || null,
        voiceId: body.voiceId || null,
        voiceStyle,
        quality,
      }),
      signal: AbortSignal.timeout(40_000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: await readApiError(response, `영상 작업 생성 실패 (${response.status})`) },
        { status: response.status },
      );
    }
    return NextResponse.json(await response.json(), { status: 202 });
  } catch (error) {
    console.error('Content studio video submit error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '영상 작업을 만들지 못했습니다.' },
      { status: 502 },
    );
  }
}
