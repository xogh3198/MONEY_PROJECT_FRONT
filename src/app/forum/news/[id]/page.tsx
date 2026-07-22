import type { Metadata } from 'next';
import NewsArticleClient from './NewsArticleClient';
import { NewsArticle } from '@/lib/news';

const SITE_URL = 'https://investboard.cloud';
const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.124.149.70:8083';

async function getArticle(id: string): Promise<NewsArticle | null> {
  try {
    const response = await fetch(`${NEWS_API}/api/news/${encodeURIComponent(id)}?trackView=false`, {
      cache: 'no-store',
    });
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

type PageParams = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return { title: '기사를 찾을 수 없습니다', robots: { index: false, follow: true } };

  const description = article.summary?.slice(0, 155) || `${article.sourceName} 기사의 핵심 요약과 InvestBoard 반응을 확인하세요.`;
  const canonical = `${SITE_URL}/forum/news/${article.id}`;
  return {
    title: article.title,
    description,
    alternates: { canonical },
    robots: { index: false, follow: true },
    openGraph: {
      title: article.title,
      description,
      url: canonical,
      type: 'article',
      publishedTime: article.publishedAt,
      siteName: 'InvestBoard',
      locale: 'ko_KR',
    },
  };
}

export default async function NewsArticlePage({ params }: { params: PageParams }) {
  const { id } = await params;
  const initialArticle = await getArticle(id);
  return <NewsArticleClient articleId={id} initialArticle={initialArticle} />;
}
