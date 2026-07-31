function normalize(value?: string): string {
  return (value || '').trim().replace(/\/+$/, '');
}

export const NEWS_API_BASE = normalize(
  process.env.NEWS_API_URL
    || process.env.NEXT_PUBLIC_NEWS_API_URL
    || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8083' : ''),
);

export const ENGINE_API_BASE = normalize(
  process.env.ENGINE_API_URL
    || process.env.NEXT_PUBLIC_ENGINE_API_URL
    || (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080' : ''),
);

export function requireApiBase(baseUrl: string, name: 'NEWS_API_URL' | 'ENGINE_API_URL'): string {
  if (!baseUrl) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }
  return baseUrl;
}
