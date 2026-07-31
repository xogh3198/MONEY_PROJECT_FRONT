import { NextRequest, NextResponse } from 'next/server';
import type { NewsArticle } from '@/lib/news';
import { NEWS_API_BASE, requireApiBase } from '@/lib/server/api-base';

type NewsPage = {
  content?: NewsArticle[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
  size?: number;
  last?: boolean;
};

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')?.trim() || '';
  const page = Math.max(0, Number(request.nextUrl.searchParams.get('page') || '0'));
  const size = Math.max(1, Math.min(30, Number(request.nextUrl.searchParams.get('size') || '20')));

  if (query.length < 2) {
    return NextResponse.json({ error: '검색어를 두 글자 이상 입력해주세요.' }, { status: 400 });
  }

  let newsApi = '';
  try {
    newsApi = requireApiBase(NEWS_API_BASE, 'NEWS_API_URL');
    const params = new URLSearchParams({
      query,
      page: String(page),
      size: String(size),
      sort: 'publishedAt,desc',
    });
    const response = await fetch(`${newsApi}/api/news/search?${params}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4_000),
    });

    if (response.ok) {
      return NextResponse.json(await response.json());
    }
  } catch {
    // 새 검색 API 배포 전이거나 일시 지연이면 최근 실제 기사 범위에서 검색을 계속한다.
  }

  try {
    newsApi = newsApi || requireApiBase(NEWS_API_BASE, 'NEWS_API_URL');
    return NextResponse.json(await searchRecentNewsFallback(newsApi, query, page, size));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '뉴스 검색 서버에 연결하지 못했습니다.' },
      { status: 503 },
    );
  }
}

async function searchRecentNewsFallback(
  newsApi: string,
  query: string,
  page: number,
  size: number,
): Promise<NewsPage> {
  const response = await fetch(
    `${newsApi}/api/news?page=0&size=50&sort=publishedAt,desc`,
    { cache: 'no-store', signal: AbortSignal.timeout(15_000) },
  );
  if (!response.ok) {
    throw new Error('최근 뉴스 목록을 불러오지 못했습니다.');
  }

  const data: NewsPage = await response.json();
  const normalizedQuery = query.toLocaleLowerCase('ko-KR');
  const matches = (data.content || []).filter(article => (
    [article.title, article.summary, article.sourceName]
      .filter(Boolean)
      .some(value => value!.toLocaleLowerCase('ko-KR').includes(normalizedQuery))
  ));
  const start = page * size;
  const content = matches.slice(start, start + size);

  return {
    content,
    totalElements: matches.length,
    totalPages: Math.ceil(matches.length / size),
    number: page,
    size,
    last: start + size >= matches.length,
  };
}
