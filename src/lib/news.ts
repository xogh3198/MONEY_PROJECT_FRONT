export type ExternalMetricStatus =
  | 'PENDING'
  | 'AVAILABLE'
  | 'NOT_SUPPORTED'
  | 'NOT_CONFIGURED'
  | 'BLOCKED_BY_POLICY'
  | 'ROBOTS_UNAVAILABLE'
  | 'INVALID_URL'
  | 'FETCH_ERROR';

export interface NewsArticle {
  id: string;
  title: string;
  summary?: string;
  sourceName: string;
  sourceUrl?: string;
  category: string;
  sentiment: string;
  viewCount: number;
  commentCount: number;
  positiveVotes: number;
  negativeVotes: number;
  externalTrendScore?: number;
  externalViewCount?: number | null;
  externalCommentCount?: number | null;
  externalPositiveCount?: number | null;
  externalNegativeCount?: number | null;
  externalEngagementScore?: number;
  externalMetricProvider?: string | null;
  externalMetricStatus?: ExternalMetricStatus;
  externalMetricsUpdatedAt?: string | null;
  externalSearchInterest?: number | null;
  externalSearchInterestSource?: string | null;
  externalSearchInterestUpdatedAt?: string | null;
  publishedAt: string;
}

export function hasExternalCounts(article: NewsArticle): boolean {
  return [
    article.externalViewCount,
    article.externalCommentCount,
    article.externalPositiveCount,
    article.externalNegativeCount,
  ].some(value => typeof value === 'number');
}

export function externalProviderLabel(provider?: string | null): string {
  switch (provider) {
    case 'YOUTUBE_API': return 'YouTube 공식 API';
    case 'SCHEMA_ORG': return '원문 공개 구조화 데이터';
    case 'NAVER_NEWS': return '네이버 뉴스';
    default: return '원문 플랫폼';
  }
}

export function externalStatusMessage(status?: ExternalMetricStatus): string {
  switch (status) {
    case 'BLOCKED_BY_POLICY': return '플랫폼 수집 정책상 원문 반응 수치를 자동으로 가져올 수 없습니다.';
    case 'NOT_SUPPORTED': return '원문이 표준 공개 반응 수치를 제공하지 않습니다.';
    case 'NOT_CONFIGURED': return '공식 API 키가 연결되면 수치를 표시할 수 있습니다.';
    case 'ROBOTS_UNAVAILABLE': return '수집 허용 여부를 확인하지 못해 안전하게 건너뛰었습니다.';
    case 'FETCH_ERROR': return '원문 반응 수치를 일시적으로 확인하지 못했습니다.';
    case 'INVALID_URL': return '확인할 수 있는 원문 주소가 없습니다.';
    case 'PENDING': return '원문 반응 수치를 확인하는 중입니다.';
    default: return '';
  }
}

export const CATEGORY_LABELS: Record<string, string> = {
  DOMESTIC: '국내증시',
  OVERSEAS: '해외증시',
  FOREX: '환율',
  RATE: '금리',
  CRYPTO: '암호화폐',
};
