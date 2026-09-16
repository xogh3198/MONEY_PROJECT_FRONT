import { NextRequest, NextResponse } from 'next/server';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Context = { params: Promise<{ path: string[] }> };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_CHUNK_BYTES = 3 * 1024 * 1024;

export async function POST(request: NextRequest, context: Context) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;
  const { path } = await context.params;
  const isStart = path.length === 1 && path[0] === 'sources';
  const isRender = path.length === 1 && path[0] === 'render';
  const isChunk = path.length === 3 && path[0] === 'sources' && UUID.test(path[1]) && path[2] === 'chunks';
  const isComplete = path.length === 3 && path[0] === 'sources' && UUID.test(path[1]) && path[2] === 'complete';
  if (!isStart && !isRender && !isChunk && !isComplete) return NextResponse.json({ error: '잘못된 경로입니다.' }, { status: 404 });
  try {
    let body: BodyInit;
    let headers: HeadersInit | undefined;
    if (isChunk) {
      const bytes = await request.arrayBuffer();
      const offset = request.headers.get('x-upload-offset');
      if (!bytes.byteLength || bytes.byteLength > MAX_CHUNK_BYTES || !offset || !/^\d+$/.test(offset)) {
        return NextResponse.json({ error: '업로드 조각 또는 순서가 올바르지 않습니다.' }, { status: 400 });
      }
      body = bytes;
      headers = { 'Content-Type': 'application/octet-stream', 'X-Upload-Offset': offset };
    } else {
      body = JSON.stringify(await request.json().catch(() => ({})));
      headers = { 'Content-Type': 'application/json' };
    }
    const response = await fetchVideoRenderApi(`/api/content-videos/shortform/${path.join('/')}`, {
      method: 'POST', headers, body, signal: AbortSignal.timeout(isChunk ? 90_000 : 40_000),
    });
    if (!response.ok) return NextResponse.json({ error: await readApiError(response, `요청 실패 (${response.status})`) }, { status: response.status });
    return NextResponse.json(await response.json(), { status: response.status, headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '영상 작업에 실패했습니다.' }, { status: 502 });
  }
}
