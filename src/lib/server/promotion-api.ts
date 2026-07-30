const fallbackBaseUrl = 'http://127.0.0.1:8083';

export function promotionApiUrl(path: string): string {
  const configured = (
    process.env.PROMOTION_API_URL
    || process.env.NEXT_PUBLIC_NEWS_API_URL
    || fallbackBaseUrl
  ).replace(/\/$/, '');
  return `${configured}${path}`;
}

export async function forwardPromotionRequest(path: string, body: unknown): Promise<Response> {
  return fetch(promotionApiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
}

export async function readPromotionResponse(response: Response): Promise<Response> {
  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
  });
}
