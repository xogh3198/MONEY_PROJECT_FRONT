import { NextRequest, NextResponse } from 'next/server';

const NEWS_API = process.env.NEXT_PUBLIC_NEWS_API_URL || 'http://15.164.171.43:8083';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${NEWS_API}/api/forum/posts/${params.id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '서버 연결 실패' }, { status: 503 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = request.headers.get('Authorization') || '';
  const body = await request.json();
  try {
    const res = await fetch(`${NEWS_API}/api/forum/posts/${params.id}`, {
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
    return NextResponse.json({ error: '서버 연결 실패' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authHeader = request.headers.get('Authorization') || '';
  try {
    const res = await fetch(`${NEWS_API}/api/forum/posts/${params.id}`, {
      method: 'DELETE',
      headers: { Authorization: authHeader },
    });
    if (res.status === 204) return new NextResponse(null, { status: 204 });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '서버 연결 실패' }, { status: 503 });
  }
}
