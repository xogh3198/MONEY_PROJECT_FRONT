import axios from 'axios';

const api = axios.create({ baseURL: '', timeout: 10000 });

// 뉴스 핫 기사
export async function fetchHotNews() {
  const res = await api.get('/api/news-hot');
  return res.data;
}

// 뉴스 목록 (카테고리 필터)
export async function fetchNewsByCategory(category?: string, page = 0) {
  const params: any = { page, size: 10, sort: 'publishedAt,desc' };
  if (category && category !== 'ALL') params.category = category;
  const res = await api.get('/api/news-list', { params });
  return res.data;
}

// 시장 지표
export async function fetchIndicators() {
  const res = await api.get('/api/market/indicators');
  return res.data;
}

// 투표
export async function voteArticle(articleId: string, type: 'positive' | 'negative') {
  // 직접 EC2 호출 (서버 사이드 아님 — 추후 API Route 추가)
}

// Auth
export async function kakaoLogin(code: string) {
  const res = await api.post('/api/auth/kakao', { code });
  return res.data;
}
