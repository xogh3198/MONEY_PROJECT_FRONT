import { NextRequest, NextResponse } from 'next/server';
import {
  ContentScriptDraft,
  PromotionVideoInput,
  ReferenceVideoAnalysis,
} from '@/lib/content-studio';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { generateGeminiJson } from '@/lib/server/gemini';
import { fetchVideoRenderApi, readApiError } from '@/lib/server/video-render-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SOURCE_TYPES = new Set(['URL', 'TEXT', 'PRODUCT', 'PLACE', 'APP', 'CONTENT']);

const SCRIPT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: '과장 없는 한국어 세로 영상 제목' },
    hook: { type: 'string', description: '첫 2초에 관심을 얻는 사실 기반 한국어 훅' },
    targetAudience: { type: 'string' },
    durationSeconds: { type: 'integer', minimum: 30, maximum: 45 },
    narration: { type: 'string', description: '30~45초 분량의 자연스러운 한국어 내레이션' },
    scenes: {
      type: 'array',
      minItems: 7,
      maxItems: 7,
      items: {
        type: 'object',
        properties: {
          order: { type: 'integer' },
          seconds: { type: 'integer', minimum: 3, maximum: 8 },
          narration: { type: 'string' },
          onScreenText: { type: 'string' },
          visualDirection: { type: 'string' },
          visualSearchTerms: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: { type: 'string' },
          },
        },
        required: ['order', 'seconds', 'narration', 'onScreenText', 'visualDirection', 'visualSearchTerms'],
      },
    },
    caption: { type: 'string' },
    hashtags: { type: 'array', minItems: 3, maxItems: 8, items: { type: 'string' } },
    siteCta: { type: 'string' },
    disclaimer: { type: 'string' },
    aiDisclosure: { type: 'string' },
    factChecks: { type: 'array', minItems: 2, maxItems: 10, items: { type: 'string' } },
    sourceCredits: { type: 'array', minItems: 1, maxItems: 8, items: { type: 'string' } },
  },
  required: [
    'title',
    'hook',
    'targetAudience',
    'durationSeconds',
    'narration',
    'scenes',
    'caption',
    'hashtags',
    'siteCta',
    'disclaimer',
    'aiDisclosure',
    'factChecks',
    'sourceCredits',
  ],
};

type GeneratedDraft = Omit<ContentScriptDraft, 'experimentId' | 'status' | 'requiresHumanReview' | 'generatedAt'>;

export async function POST(request: NextRequest) {
  const unauthorized = authorizeContentStudio(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json() as { input?: PromotionVideoInput };
    const input = normalizeInput(body.input);
    if (!input) {
      return NextResponse.json({ error: '홍보할 대상의 이름과 설명을 입력해 주세요.' }, { status: 400 });
    }

    const referenceAnalysis = await analyzeReferenceVideo(input);
    const generated = await generateGeminiJson<GeneratedDraft>(
      buildPrompt(input, referenceAnalysis),
      SCRIPT_SCHEMA,
    );
    const draft: ContentScriptDraft = {
      ...generated,
      experimentId: `promotion-${compactTimestamp()}`,
      status: 'DRAFT',
      requiresHumanReview: true,
      generatedAt: new Date().toISOString(),
      stylePrompt: input.stylePrompt,
      referenceVideoUrl: input.referenceVideoUrl,
      referenceAnalysis,
    };

    if (draft.scenes?.length !== 7 || !draft.narration || !draft.factChecks?.length) {
      throw new Error('필수 초안 필드가 비어 있습니다.');
    }

    return NextResponse.json({ input, draft });
  } catch (error) {
    console.error('Promotion content script error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '홍보 영상 초안을 만들지 못했습니다.' },
      { status: 502 },
    );
  }
}

function compactTimestamp(): string {
  return new Date().toISOString()
    .replaceAll('-', '')
    .replaceAll(':', '')
    .replaceAll('.', '')
    .replaceAll('T', '')
    .replaceAll('Z', '')
    .slice(0, 14);
}

function normalizeInput(input?: PromotionVideoInput): PromotionVideoInput | null {
  if (!input || !SOURCE_TYPES.has(input.sourceType)) return null;

  const title = input.title?.trim().slice(0, 160);
  const description = input.description?.trim().slice(0, 4_000);
  if (!title || !description) return null;

  const sourceUrl = cleanPublicUrl(input.sourceUrl);
  const referenceLinks = (input.referenceLinks || [])
    .map(cleanPublicUrl)
    .filter((item): item is string => Boolean(item))
    .slice(0, 5);

  return {
    sourceType: input.sourceType,
    title,
    description,
    sourceUrl,
    referenceLinks,
    targetAudience: input.targetAudience?.trim().slice(0, 300) || '핵심 고객',
    goal: input.goal?.trim().slice(0, 120) || '인지도',
    callToAction: input.callToAction?.trim().slice(0, 300) || '자세히 알아보기',
    verifiedFacts: (input.verifiedFacts || []).map(item => item.trim()).filter(Boolean).slice(0, 10),
    ownedAssetNotes: input.ownedAssetNotes?.trim().slice(0, 1_000) || '제공된 사용권 확인 자산 없음',
    referenceVideoUrl: cleanYouTubeUrl(input.referenceVideoUrl),
    stylePrompt: input.stylePrompt?.trim().slice(0, 800)
      || '사람이 직접 편집한 듯 자연스럽고 정보 중심인 세로형 숏폼',
    referenceAnalysisConsent: Boolean(input.referenceAnalysisConsent && input.referenceVideoUrl),
  };
}

function cleanPublicUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function cleanYouTubeUrl(value?: string): string | undefined {
  const cleaned = cleanPublicUrl(value);
  if (!cleaned) return undefined;
  const url = new URL(cleaned);
  const host = url.hostname.toLowerCase();
  if (!['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'].includes(host)) return undefined;
  return url.toString();
}

async function analyzeReferenceVideo(input: PromotionVideoInput): Promise<ReferenceVideoAnalysis | undefined> {
  if (!input.referenceVideoUrl || !input.referenceAnalysisConsent) return undefined;
  try {
    const response = await fetchVideoRenderApi('/api/content-videos/reference-analysis', {
      method: 'POST',
      body: JSON.stringify({
        referenceVideoUrl: input.referenceVideoUrl,
        stylePrompt: input.stylePrompt,
      }),
      signal: AbortSignal.timeout(65_000),
    });
    if (!response.ok) {
      throw new Error(await readApiError(response, `참고 영상 분석 실패 (${response.status})`));
    }
    return await response.json() as ReferenceVideoAnalysis;
  } catch (error) {
    return {
      provider: 'APIFY',
      status: 'FAILED',
      sourceUrl: input.referenceVideoUrl,
      styleSummary: `${input.stylePrompt || '자연스러운 정보형 숏폼'}. 원문의 문장·영상·음성은 복제하지 않습니다.`,
      note: error instanceof Error ? error.message : '참고 영상 분석을 완료하지 못했습니다.',
    };
  }
}

function buildPrompt(input: PromotionVideoInput, referenceAnalysis?: ReferenceVideoAnalysis): string {
  return `당신은 사람이 직접 편집한 듯 간결하고 구체적인 한국어 숏폼 홍보 영상의 편집자입니다.

아래 사용자가 제공한 정보만 근거로 9:16 세로형 30~45초 홍보 영상 초안을 만드세요.

편집 원칙:
- 입력에 없는 성과, 후기, 숫자, 기능, 가격을 만들지 않습니다.
- 사용자가 verifiedFacts에 넣은 내용도 게시 전에 다시 확인할 항목으로 factChecks에 남깁니다.
- 흔한 AI 문구, 과장, 억지 감탄, 같은 말의 반복, 결론을 숨기는 낚시를 피합니다.
- 짧은 문장과 구체적인 문제 상황으로 시작하고, 제품명보다 고객이 얻는 변화를 먼저 보여줍니다.
- 배경음악을 전제로 하지 않습니다. 내레이션, 큰 자막, 장면 전환만으로 이해되게 합니다.
- 고객 제공 화면·제품 사진·매장 사진·직접 만든 카드뉴스를 우선 사용합니다.
- 외부 이미지는 권리가 확인된 스톡만 제안하고, 로고·인물·기사 캡처를 임의로 가져오지 않습니다.
- 장면은 정확히 7개입니다: 1) 2초 문제 훅 2) 공감 상황 3) 해결 방식
  4) 확인된 차별점 5) 실제 사용 장면 6) 다음 행동 7) CTA와 필요한 고지.
- onScreenText는 22자 안팎, narration은 말하듯 자연스럽게 씁니다.
- visualDirection에 필요한 구도와 사용할 수 있는 자산 종류를 구체적으로 씁니다.
- sourceCredits에는 입력 URL과 참고 링크를 기록합니다. 링크가 없으면 "사용자 제공 설명"을 기록합니다.
- aiDisclosure에는 "AI 보조로 대본·음성·자막을 제작했으며 게시 전 사람이 검수함"을 명시합니다.
- disclaimer는 업종에 맞는 주의 문구를 작성하되, 규제 업종이 아니면 사실·조건 확인 문구만 간단히 씁니다.
- 외부 게시, 광고 집행, 성과 보장을 약속하지 않습니다.
- 참고 영상은 훅 시점, 자막 전환 속도, 정보 밀도 같은 구조만 참고합니다. 원문의 문장, 장면, 음성,
  크리에이터의 고유 표현을 복제하거나 비슷하게 재현하지 않습니다.
- 장면 visualDirection은 실제 고객 자산을 우선하되, 자산이 없는 장면은 AI 생성 영상으로 바꿀 수 있도록
  한 장면에 한 피사체와 구체적인 동작을 제안합니다. AI 화면에 글자·로고·실제 인물·가짜 UI를 만들지 않습니다.

사용자 입력:
${JSON.stringify(input, null, 2)}

참고 영상에서 파생한 구조 지표(원문 미포함):
${JSON.stringify(referenceAnalysis || { status: 'NOT_USED' }, null, 2)}`;
}
