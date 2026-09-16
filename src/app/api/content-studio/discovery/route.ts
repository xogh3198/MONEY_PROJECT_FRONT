import { NextRequest, NextResponse } from 'next/server';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;
  const search = request.nextUrl.searchParams;
  const query = (search.get('q') || '').trim();
  const language = search.get('language') || 'ko';
  const days = Number(search.get('days') || '30');
  const minMinutes = Number(search.get('minMinutes') || '4');
  if (query.length < 2 || query.length > 80 || !['ko', 'ja', 'all'].includes(language)
      || !Number.isInteger(days) || days < 1 || days > 365
      || !Number.isInteger(minMinutes) || minMinutes < 0 || minMinutes > 60) {
    return NextResponse.json({ error: '검색 조건을 확인해주세요.' }, { status: 400 });
  }
  const params = new URLSearchParams({ q: query, language, days: String(days), minMinutes: String(minMinutes), reusable: search.get('reusable') === 'true' ? 'true' : 'false', strictAudio: search.get('strictAudio') === 'false' ? 'false' : 'true' });
  try {
    const response = await fetchVideoRenderApi(`/api/content-videos/discovery/youtube?${params}`, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) return NextResponse.json({ error: await readApiError(response, 'YouTube 검색에 실패했습니다.') }, { status: response.status });
    return NextResponse.json(await response.json(), { headers: { 'Cache-Control': 'private, no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '검색 연결에 실패했습니다.' }, { status: 502 });
  }
}
