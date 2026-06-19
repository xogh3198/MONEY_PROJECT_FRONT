import { NextRequest, NextResponse } from 'next/server';

const ENGINE_API = process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://15.164.171.43:8080';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('Authorization') || '';
  try {
    const res = await fetch(`${ENGINE_API}/api/notification-preferences`, {
      headers: { Authorization: authHeader },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '?œë²„ ?°ê²° ?¤íŒ¨' }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('Authorization') || '';
  const body = await request.json();
  try {
    const res = await fetch(`${ENGINE_API}/api/notification-preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '?œë²„ ?°ê²° ?¤íŒ¨' }, { status: 503 });
  }
}
