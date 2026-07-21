const DEFAULT_MODEL = 'gemini-3.1-flash-lite';

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
}

export async function generateGeminiText(prompt: string): Promise<string> {
  const response = await callGemini(prompt, { temperature: 0.35 });
  return readText(response);
}

export async function generateGeminiJson<T>(prompt: string, responseSchema: Record<string, unknown>): Promise<T> {
  const response = await callGemini(prompt, {
    temperature: 0.35,
    responseMimeType: 'application/json',
    responseSchema,
  });
  const text = readText(response);

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error('Gemini가 유효한 JSON을 반환하지 않았습니다.');
  }
}

async function callGemini(prompt: string, generationConfig: Record<string, unknown>): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');

  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig,
      }),
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`Gemini API 오류 (${response.status}): ${detail}`);
  }

  return response.json() as Promise<GeminiResponse>;
}

function readText(response: GeminiResponse): string {
  const text = response.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
  if (!text) throw new Error('Gemini 응답에 텍스트가 없습니다.');
  return text;
}

