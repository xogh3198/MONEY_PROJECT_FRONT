import axios from 'axios';

// Next.js rewrites를 통한 프록시 — Mixed Content 문제 해결
// 프론트 자체 도메인의 /api/... 경로로 호출하면 Next.js가 백엔드로 프록시
const API_BASE = '';  // 빈 문자열 = 같은 도메인 (rewrites가 처리)

export const newsApi = axios.create({ baseURL: API_BASE, timeout: 10000 });
export const engineApi = axios.create({ baseURL: API_BASE, timeout: 10000 });

// 인증 토큰 설정
export function setAuthToken(token: string) {
  engineApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  newsApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// News API
export async function fetchHotNews() {
  const res = await newsApi.get('/api/news/hot');
  return res.data;
}

export async function fetchNewsByCategory(category?: string, page = 0) {
  const params: any = { page, size: 10, sort: 'publishedAt,desc' };
  if (category && category !== 'ALL') params.category = category;
  const res = await newsApi.get('/api/news', { params });
  return res.data;
}

export async function voteArticle(articleId: string, type: 'positive' | 'negative') {
  await newsApi.post(`/api/news/${articleId}/vote?type=${type}`);
}

export async function fetchComments(articleId: string, page = 0) {
  const res = await newsApi.get(`/api/forum/comments/${articleId}`, { params: { page, size: 20 } });
  return res.data;
}

export async function postComment(articleId: string, content: string, username: string) {
  const res = await newsApi.post('/api/forum/comments', {
    articleId, content, username, userId: crypto.randomUUID(),
  });
  return res.data;
}

// Market API
export async function fetchIndicators() {
  const res = await newsApi.get('/api/market/indicators');
  return res.data;
}

// Auth API
export async function kakaoLogin(code: string) {
  const res = await engineApi.post('/api/auth/kakao', { code });
  return res.data;
}
