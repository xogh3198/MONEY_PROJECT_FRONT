import { NextRequest, NextResponse } from 'next/server';
import { NEWS_API_BASE as NEWS_API } from '@/lib/server/api-base';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authHeader = request.headers.get('Authorization') || '';

  try {
    const body = await request.json();
    const res = await fetch(`${NEWS_API}/api/forum/articles/${id}/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '투표를 처리하지 못했습니다.' }, { status: 502 });
  }
}
