import { NextRequest, NextResponse } from 'next/server';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Vercel Functions cap request payloads at 4.5 MB, including multipart overhead.
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
]);

export async function POST(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  try {
    const incoming = await request.formData();
    const file = incoming.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: '업로드할 사진 또는 영상 파일이 필요합니다.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'JPG, PNG, WebP, MP4, WebM, MOV 파일만 사용할 수 있습니다.' }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: '장면 파일은 4MB 이하여야 합니다.' }, { status: 413 });
    }

    const outgoing = new FormData();
    outgoing.set('file', file, file.name);
    const response = await fetchVideoRenderApi('/api/content-videos/assets', {
      method: 'POST',
      body: outgoing,
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: await readApiError(response, `장면 파일 업로드 실패 (${response.status})`) },
        { status: response.status },
      );
    }
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Content studio asset upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '장면 파일을 업로드하지 못했습니다.' },
      { status: 502 },
    );
  }
}
