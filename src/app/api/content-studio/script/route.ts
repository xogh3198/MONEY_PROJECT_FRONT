import { NextRequest, NextResponse } from 'next/server';
import { ContentOpportunity, ContentScriptDraft } from '@/lib/content-studio';
import { authorizeContentStudio } from '@/lib/server/content-studio-auth';
import { generateGeminiJson } from '@/lib/server/gemini';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const SCRIPT_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string', description: '과장 없이 핵심을 설명하는 한국어 쇼츠 제목' },
    hook: { type: 'string', description: '첫 1~2초에 사용할 사실 기반 한국어 훅' },
    targetAudience: { type: 'string' },
    durationSeconds: { type: 'integer', minimum: 35, maximum: 65 },
    narration: { type: 'string', description: '45~60초 분량의 완전한 한국어 내레이션' },
    scenes: {
      type: 'array',
      minItems: 7,
      maxItems: 7,
      items: {
        type: 'object',
        properties: {
          order: { type: 'integer' },
          seconds: { type: 'integer', minimum: 4, maximum: 11 },
          narration: { type: 'string' },
          onScreenText: { type: 'string' },
          visualDirection: { type: 'string' },
          visualSearchTerms: {
            type: 'array',
            minItems: 1,
            maxItems: 3,
            items: { type: 'string' },
            description: 'Pixabay 등 권리 확인 자산 검색에 쓸 일반적인 한국어 핵심어',
          },
        },
        required: ['order', 'seconds', 'narration', 'onScreenText', 'visualDirection', 'visualSearchTerms'],
      },
    },
    caption: { type: 'string' },
    hashtags: { type: 'array', minItems: 3, maxItems: 10, items: { type: 'string' } },
    siteCta: { type: 'string' },
    disclaimer: { type: 'string' },
    aiDisclosure: { type: 'string' },
    factChecks: { type: 'array', minItems: 2, maxItems: 8, items: { type: 'string' } },
    sourceCredits: { type: 'array', minItems: 1, maxItems: 5, items: { type: 'string' } },
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
    const body = (await request.json()) as { opportunity?: ContentOpportunity };
    const opportunity = body.opportunity;

    if (!opportunity?.id || !opportunity.title || opportunity.title.length > 240) {
      return NextResponse.json({ error: '유효한 콘텐츠 후보가 필요합니다.' }, { status: 400 });
    }

    const prompt = buildPrompt(opportunity);
    const generated = await generateGeminiJson<GeneratedDraft>(prompt, SCRIPT_SCHEMA);
    const draft: ContentScriptDraft = {
      ...generated,
      experimentId: `content-${compactTimestamp()}-${opportunity.id.slice(0, 8)}`,
      status: 'DRAFT',
      requiresHumanReview: true,
      generatedAt: new Date().toISOString(),
    };

    if (draft.scenes?.length !== 7 || !draft.narration || !draft.sourceCredits?.length) {
      throw new Error('필수 초안 필드가 비어 있습니다.');
    }

    return NextResponse.json({ opportunity, draft });
  } catch (error) {
    console.error('Content script error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '콘텐츠 초안을 생성하지 못했습니다.' },
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

function buildPrompt(opportunity: ContentOpportunity): string {
  const safeInput = {
    title: opportunity.title,
    summary: opportunity.summary,
    sourceName: opportunity.sourceName,
    sourceUrl: opportunity.sourceUrl,
    category: opportunity.category,
    publishedAt: opportunity.publishedAt,
    proposedAngle: opportunity.angle,
    marketContext: opportunity.marketContext,
    sitePath: opportunity.sitePath,
    riskFlags: opportunity.riskFlags,
  };

  return `당신은 InvestBoard의 한국어 금융 교육 콘텐츠 편집자입니다.

아래 입력만 근거로 9:16 세로형 45~55초 이미지 중심 쇼츠 초안을 작성하세요.

필수 원칙:
- 기사를 낭독하거나 문장만 바꾸지 말고, 개인 투자자가 이해할 수 있는 원인·영향·확인할 지표를 설명합니다.
- 입력에 없는 사실, 숫자, 인용을 만들지 않습니다. 확인이 필요한 항목은 factChecks에 기록합니다.
- 사실과 분석/추론을 구분합니다.
- 매수·매도 지시, 수익 보장, 공포 조장, 오해를 부르는 클릭베이트를 사용하지 않습니다.
- 영상·이미지는 자체 차트, 타이포그래피, 라이선스가 확인된 자산만 쓰도록 지시합니다.
- 마지막 CTA는 광고 클릭 요청이 아니라 https://investboard.cloud${opportunity.sitePath} 에서 관련 데이터 확인입니다.
- 출처를 sourceCredits에 매체명과 URL로 명시합니다.
- disclaimer에는 정보 제공 목적이며 투자 조언이 아니라는 문구를 넣습니다.
- aiDisclosure에는 AI 보조 제작이며 게시 전 사실 검수를 거친다는 문구를 넣습니다.
- scenes의 narration을 순서대로 합치면 전체 narration과 같은 흐름이 되게 합니다.
- scenes는 정확히 7개로 만듭니다: 1) 궁금증 훅 2) 무슨 일인지 3) 핵심 숫자
  4) 왜 중요한지 5) 개인에게 미치는 영향 6) 다음 확인 지표 7) CTA와 투자 고지.
- 장면마다 관련 사진 한 장과 느린 줌을 전제로 하고, visualSearchTerms에는 상표·인물명보다
  경제 개념·사물·장소 중심의 일반적인 한국어 검색어 1~3개를 넣습니다.
- onScreenText는 모바일 한 화면에서 읽히도록 24자 안팎의 강한 요약으로 작성합니다.
- 억양은 문장을 짧게 나누고 첫 문장에서 궁금증을 만들되, 사실을 과장하거나 결론을 숨기지 않습니다.

입력:
${JSON.stringify(safeInput, null, 2)}`;
}
