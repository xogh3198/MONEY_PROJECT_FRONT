const DEFAULT_NEWS_API = 'http://13.125.169.237:8083';

export function videoRenderApiConfig(): { baseUrl: string; accessKey: string } {
  const baseUrl = (
    process.env.VIDEO_RENDER_API_URL
    || process.env.NEXT_PUBLIC_NEWS_API_URL
    || DEFAULT_NEWS_API
  ).replace(/\/+$/, '');
  const accessKey = (
    process.env.VIDEO_RENDER_ACCESS_KEY
    || process.env.CONTENT_STUDIO_ACCESS_KEY
    || ''
  ).trim();

  if (!accessKey) {
    throw new Error('VIDEO_RENDER_ACCESS_KEY 또는 CONTENT_STUDIO_ACCESS_KEY가 설정되지 않았습니다.');
  }
  return { baseUrl, accessKey };
}

export async function fetchVideoRenderApi(path: string, init: RequestInit = {}): Promise<Response> {
  const { baseUrl, accessKey } = videoRenderApiConfig();
  const headers = new Headers(init.headers);
  headers.set('X-Video-Render-Key', accessKey);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(`${baseUrl}${path}`, {
    ...init,
    headers,
    cache: 'no-store',
    signal: init.signal || AbortSignal.timeout(30_000),
  });
}

export async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json() as { error?: string; message?: string; detail?: string };
    return data.error || data.message || data.detail || fallback;
  } catch {
    return fallback;
  }
}
