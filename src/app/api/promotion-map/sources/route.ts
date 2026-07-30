import { NextRequest } from 'next/server';
import { forwardPromotionRequest, readPromotionResponse } from '@/lib/server/promotion-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await forwardPromotionRequest('/api/v1/promotion-sources', body);
    return readPromotionResponse(response);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : '홍보 대상을 접수하지 못했습니다.' },
      { status: 502 },
    );
  }
}
