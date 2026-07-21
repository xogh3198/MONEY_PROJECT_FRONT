import { NextResponse } from 'next/server';
import { generateGeminiText } from '@/lib/server/gemini';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://13.124.149.70:8083';

export const dynamic = 'force-dynamic'; // 빌드 시 호출 방지

export async function GET() {
  try {
    // 키 없으면 기본 분석
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        analysis: 'Gemini API 키가 설정되지 않았습니다. Vercel 환경변수에 GEMINI_API_KEY를 설정해주세요.',
        updatedAt: new Date().toISOString(),
        indicators: '',
      });
    }

    // 1. 시장 지표 가져오기
    const indicatorRes = await fetch(`${NEWS_API}/api/market/indicators`);
    const indicators = await indicatorRes.json();

    // 2. 최신 뉴스 가져오기
    const newsRes = await fetch(`${NEWS_API}/api/news/hot`);
    const news = await newsRes.json();

    const newsHeadlines = news.slice(0, 5).map((n: any) => `- ${n.title} (${n.sentiment})`).join('\n');
    const indicatorSummary = indicators.map((i: any) =>
      `${i.name}: ${i.value} (${i.changePercent > 0 ? '+' : ''}${i.changePercent}%)`
    ).join(', ');

    // 3. Gemini API 호출 (GEMINI_MODEL, 기본 gemini-3.1-flash-lite)
    const prompt = `당신은 한국 경제/주식 시장을 설명하는 데이터 저널리스트입니다.

현재 시장 지표:
${indicatorSummary}

최신 경제 뉴스:
${newsHeadlines}

위 데이터를 기반으로 다음을 분석해주세요:
1. 오늘 시장 요약 (2~3문장)
2. 코스피 단기 시나리오 (상승/하락/보합 가능성과 근거 1문장, 단정 금지)
3. 확인해야 할 리스크 1가지
4. 다음으로 관찰할 시장 데이터 1가지

필수 원칙:
- 매수·매도·보유, 현금 비중, 종목 선택 등 투자 행동을 지시하지 않습니다.
- 수익을 보장하거나 공포를 조장하지 않습니다.
- 사실과 해석을 구분하고 불확실성을 명시합니다.
- 마지막 문장은 반드시 "이 내용은 정보 제공 목적이며 투자 조언이 아닙니다."로 끝냅니다.

간결하게 총 5~8문장으로 답변해주세요. 한국어로 작성하세요.`;

    const generated = await generateGeminiText(prompt);
    const disclaimer = '이 내용은 정보 제공 목적이며 투자 조언이 아닙니다.';
    const text = generated.includes(disclaimer) ? generated : `${generated}\n\n${disclaimer}`;

    return NextResponse.json({
      analysis: text,
      updatedAt: new Date().toISOString(),
      indicators: indicatorSummary,
    });
  } catch (error) {
    console.error('AI prediction error:', error);
    return NextResponse.json({
      analysis: 'AI 분석을 일시적으로 이용할 수 없습니다.',
      updatedAt: new Date().toISOString(),
      indicators: '',
    });
  }
}
