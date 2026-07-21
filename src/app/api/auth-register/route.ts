import { NextRequest, NextResponse } from 'next/server';

const ENGINE_API = process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://13.124.149.70:8080';

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const res = await fetch(`${ENGINE_API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '서버 연결 실패' }, { status: 500 });
  }
}
