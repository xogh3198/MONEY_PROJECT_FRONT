import { NextRequest, NextResponse } from 'next/server';

const ENGINE_API = process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://15.164.171.43:8080';
const KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID || process.env.KAKAO_REST_API_KEY || '';
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET || '';
const KAKAO_REDIRECT_URI = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/kakao/callback`
  : 'https://investboard.cloud/auth/kakao/callback';

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code) {
    return NextResponse.json({ error: '?�증 코드가 ?�습?�다' }, { status: 400 });
  }

  try {
    // 1. 카카?�에??access_token 발급
    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        client_secret: KAKAO_CLIENT_SECRET,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      }),
    });
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error('Kakao token error:', tokenData);
      return NextResponse.json({ error: '카카???�증???�패?�습?�다' }, { status: 401 });
    }

    // 2. 카카???�용???�로??조회
    const profileRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileRes.json();

    const kakaoUser = {
      id: String(profileData.id),
      nickname: profileData.kakao_account?.profile?.nickname || '카카?�사?�자',
      email: profileData.kakao_account?.email || '',
    };

    // 3. 백엔?�에 카카???�용???�보 ?�달
    const res = await fetch(`${ENGINE_API}/api/auth/kakao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kakaoUserId: kakaoUser.id, nickname: kakaoUser.nickname, email: kakaoUser.email }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Kakao auth error:', error?.message || error);
    return NextResponse.json({ error: '카카??로그??처리 �??�류가 발생?�습?�다' }, { status: 500 });
  }
}
