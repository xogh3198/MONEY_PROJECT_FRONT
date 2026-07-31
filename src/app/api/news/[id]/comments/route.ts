import { NextRequest, NextResponse } from 'next/server';
import { NEWS_API_BASE as NEWS_API } from '@/lib/server/api-base';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const search = request.nextUrl.searchParams.toString();

  try {
    const res = await fetch(
      `${NEWS_API}/api/forum/comments/${id}${search ? `?${search}` : ''}`,
      { cache: 'no-store' },
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ content: [], totalElements: 0 }, { status: 502 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const authHeader = request.headers.get('Authorization') || '';

  try {
    const body = await request.json();
    const res = await fetch(`${NEWS_API}/api/forum/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ articleId: id, content: body.content }),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: '댓글을 등록하지 못했습니다.' }, { status: 502 });
  }
}
