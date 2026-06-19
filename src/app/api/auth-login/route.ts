import { NextRequest, NextResponse } from 'next/server';

const ENGINE_API = process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://15.164.171.43:8080';

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const res = await fetch(`${ENGINE_API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Auth login error:', error?.message || error);
    return NextResponse.json({ error: '?œë²„???°ê²°?????†ìŠµ?ˆë‹¤. ? ì‹œ ???¤ì‹œ ?œë„?´ì£¼?¸ìš”.' }, { status: 503 });
  }
}
