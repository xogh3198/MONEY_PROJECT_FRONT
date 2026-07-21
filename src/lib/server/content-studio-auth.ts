import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const HEADER_NAME = 'x-content-studio-key';

export function authorizeContentStudio(request: NextRequest): NextResponse | null {
  const configured = process.env.CONTENT_STUDIO_ACCESS_KEY?.trim();

  if (!configured) {
    return NextResponse.json(
      { error: 'CONTENT_STUDIO_ACCESS_KEY가 설정되지 않았습니다.' },
      { status: 503 },
    );
  }

  const supplied = request.headers.get(HEADER_NAME)?.trim() || '';
  if (!safeEqual(configured, supplied)) {
    return NextResponse.json({ error: '콘텐츠 스튜디오 접근 키가 올바르지 않습니다.' }, { status: 401 });
  }

  return null;
}

function safeEqual(expected: string, actual: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

