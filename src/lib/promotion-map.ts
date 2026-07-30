export type PromotionSourceType = 'URL' | 'TEXT' | 'PRODUCT' | 'PLACE' | 'APP' | 'CONTENT';

export interface PromotionSourceInput {
  sourceType: PromotionSourceType;
  url?: string;
  title?: string;
  description?: string;
  referenceLinks?: string[];
}

export interface Evidence {
  label: string;
  value: string;
  sourceUrl: string;
}

export interface WebsiteAnalysis {
  analysisId: string;
  sourceType: PromotionSourceType;
  canonicalUrl: string;
  status: 'NEEDS_CONFIRMATION';
  title: string;
  sourceSummary: string;
  industry: string;
  targetAudienceHypotheses: string[];
  primaryCtas: string[];
  serviceRegions: string[];
  evidence: Evidence[];
  warnings: string[];
  analyzedAt: string;
}

export interface PromotionBrief {
  analysisId: string;
  goal: string;
  targetAudience: string;
  targetRegion: string;
  monthlyBudget: number;
  productionCapabilities: string[];
}

export interface ChannelRecommendation {
  channelId: string;
  name: string;
  priority: '우선 실행' | '실험' | '보류' | '제외';
  score: number;
  reason: string;
  funnelStage: string;
  estimatedCostMin: number;
  estimatedCostMax: number;
  estimatedHours: number;
  confidence: '낮음' | '보통' | '높음';
  warning: string | null;
  sourceUrl: string;
  verifiedAt: string;
}

export interface CostScenario {
  id: string;
  name: string;
  description: string;
  mediaCost: number;
  productionCost: number;
  operationCost: number;
  toolCost: number;
  contingency: number;
  totalCost: number;
}

export interface PromotionAction {
  id: string;
  title: string;
  reason: string;
  channelName: string;
  contentType: string;
  hook: string;
  preparation: string[];
  estimatedCost: number;
  estimatedHours: number;
  status: '시작 전';
}

export interface PromotionPlan {
  planId: string;
  analysisId: string;
  strategySummary: string;
  recommendations: ChannelRecommendation[];
  costScenarios: CostScenario[];
  actions: PromotionAction[];
  assumptions: string[];
  generatedAt: string;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null) as { error?: string; message?: string } | null;
  if (!response.ok) {
    throw new Error(data?.error || data?.message || '요청을 처리하지 못했습니다.');
  }
  return data as T;
}

export function createWebsiteAnalysis(input: PromotionSourceInput) {
  return request<WebsiteAnalysis>('/api/promotion-map/sources', input);
}

export function createPromotionPlan(brief: PromotionBrief) {
  return request<PromotionPlan>('/api/promotion-map/plans', brief);
}
