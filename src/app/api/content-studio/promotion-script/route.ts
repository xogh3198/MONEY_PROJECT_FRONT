import { NextRequest, NextResponse } from 'next/server';
import {
  ContentScriptDraft,
  PromotionVideoInput,
  ReferenceVideoAnalysis,
  VideoVoiceStyle,
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
    durationSeconds: { type: 'integer', minimum: 18, maximum: 28 },
    narration: { type: 'string', description: '18~28초 분량의 캐릭터 대화체 한국어 내레이션' },
    scenes: {
      type: 'array',
      minItems: 5,
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          order: { type: 'integer' },
          seconds: { type: 'integer', minimum: 2, maximum: 7 },
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
    const body = await request.json() as {
      input?: PromotionVideoInput;
      voiceStyle?: VideoVoiceStyle;
    };
    const input = normalizeInput(body.input);
    if (!input) {
      return NextResponse.json({ error: '홍보할 대상의 이름과 설명을 입력해 주세요.' }, { status: 400 });
    }

    const voiceStyle = normalizeVoiceStyle(body.voiceStyle);
    const referenceAnalysis = await analyzeReferenceVideo(input);
    const generated = await generateGeminiJson<GeneratedDraft>(
      buildPrompt(input, referenceAnalysis, voiceStyle),
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

    if (draft.scenes?.length !== 5 || !draft.narration || !draft.factChecks?.length) {
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

function normalizeVoiceStyle(value?: VideoVoiceStyle): VideoVoiceStyle {
  if (value === 'WHISPER' || value === 'SNARKY') return value;
  return 'NATURAL';
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

function buildPrompt(
  input: PromotionVideoInput,
  referenceAnalysis: ReferenceVideoAnalysis | undefined,
  voiceStyle: VideoVoiceStyle,
): string {
  return `당신은 실제 사람이 혼잣말하듯 시작하는 한국어 캐릭터 숏폼의 대본 작가이자 편집자입니다.

아래 사용자가 제공한 정보만 근거로 9:16 세로형 18~28초 홍보 영상 초안을 만드세요.

이번 음성 연기 방향:
${voicePerformanceGuide(voiceStyle)}

대본 리듬:
- 첫 문장은 설명 없이 캐릭터가 처한 작은 곤란, 실수, 걱정 또는 의외의 상황을 고백합니다.
- 이어서 시청자가 질문한 것처럼 짧게 되묻습니다. 예: "왜 그러냐고요?", "아직도요?"
- 문제를 두세 개의 짧은 구어체 문장으로 보여주고, 제품명과 해결책은 초반에 바로 말하지 않습니다.
- 중간 이후에 해결책을 공개하고, 마지막은 명령형 구매 유도 대신 캐릭터다운 부탁·머뭇거림·자조로 끝냅니다.
- 같은 시작 문구를 반복 생산하지 않습니다. "큰일 났어요"는 사실에 맞을 때만 후보 중 하나로 사용하고,
  "좀 곤란해졌어요", "제가 괜한 걸 만들었나 봐요", "이걸 아직도 하고 계셨어요?"처럼 소재에 맞게 변주합니다.
- 한 문장은 되도록 4~18자, 한 호흡에 한 정보만 담습니다. 조사와 접속어를 줄이고 줄바꿈·말줄임표·되묻기로 호흡을 만듭니다.
- 대괄호 음성 태그는 쓰지 않습니다. 실제 음성 스타일은 렌더러가 별도로 적용합니다.
- 실제 인물이나 크리에이터의 고유 문장·말버릇·캐릭터를 모방하지 않고 위의 일반적인 숏폼 리듬만 사용합니다.

편집 원칙:
- 입력에 없는 성과, 후기, 숫자, 기능, 가격을 만들지 않습니다.
- 사용자가 verifiedFacts에 넣은 내용도 게시 전에 다시 확인할 항목으로 factChecks에 남깁니다.
- 흔한 AI 문구, 아나운서체, 홈쇼핑체, 과장, 억지 감탄, 기능 나열, 같은 말의 반복을 피합니다.
- "간편하게 만나보세요", "지금 바로 확인하세요", "혁신적인", "새로운 경험" 같은 광고 문구를 쓰지 않습니다.
- 관심을 끌기 위한 곤란은 실제 입력에서 확인 가능한 상황을 가볍게 표현한 것이어야 하며 피해·실패를 꾸며내지 않습니다.
- 배경음악을 전제로 하지 않습니다. 내레이션, 큰 자막, 장면 전환만으로 이해되게 합니다.
- 고객 제공 화면·제품 사진·매장 사진·직접 만든 카드뉴스를 우선 사용합니다.
- 외부 이미지는 권리가 확인된 스톡만 제안하고, 로고·인물·기사 캡처를 임의로 가져오지 않습니다.
- 장면은 정확히 5개입니다: 1) 2초 고백형 훅 2) 되묻기와 공감 상황 3) 뒤늦은 해결책 공개
  4) 실제 사용 또는 확인된 변화 5) 캐릭터다운 CTA와 필요한 고지.
- onScreenText는 18자 안팎, narration은 친구에게 말하듯 자연스럽게 씁니다.
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

function voicePerformanceGuide(style: VideoVoiceStyle): string {
  if (style === 'SNARKY') {
    return `건조하고 약간 투덜대는 캐릭터 음성입니다. 화를 내거나 비꼬아 공격하지 말고,
본인이 먼저 머쓱해하는 자조와 짧은 반문을 사용합니다. 핵심 단어는 짧게 끊어 귀에 남게 씁니다.`;
  }
  if (style === 'WHISPER') {
    return `가까운 거리에서 조심스럽게 말하는 소심한 캐릭터 음성입니다. 비밀을 알려주듯 낮게 시작하고,
중간에 호기심을 높인 뒤 해결책에서는 또렷해집니다. 공포 연기나 과도한 숨소리는 피합니다.`;
  }
  return `꾸미지 않은 생활 대화형 캐릭터 음성입니다. 광고를 읽지 말고 실제 경험을 털어놓듯 말하며,
짧은 반문과 자연스러운 머뭇거림을 사용하되 정보는 또렷하게 전달합니다.`;
}
