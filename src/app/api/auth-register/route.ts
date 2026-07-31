import { NextRequest, NextResponse } from 'next/server';
import { ENGINE_API_BASE as ENGINE_API } from '@/lib/server/api-base';

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
