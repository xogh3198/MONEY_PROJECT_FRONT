import { NextRequest, NextResponse } from 'next/server';

const ENGINE_API = process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://15.164.171.43:8080';
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || '';
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || '';

export async function POST(request: NextRequest) {
  const { code, state } = await request.json();

  if (!code) {
    return NextResponse.json({ error: '인증 코드가 없습니다' }, { status: 400 });
  }

  try {
    // 1. 네이버에서 access_token 발급
    const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error('Naver token error:', tokenData);
      return NextResponse.json({ error: '네이버 인증에 실패했습니다' }, { status: 401 });
    }

    // 2. 네이버 사용자 프로필 조회
    const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileRes.json();

    if (profileData.resultcode !== '00') {
      return NextResponse.json({ error: '프로필 조회에 실패했습니다' }, { status: 401 });
    }

    const naverUser = profileData.response;
    // naverUser: { id, nickname, email, name, ... }

    // 3. 백엔드에 네이버 사용자 정보 전달하여 로그인/회원가입 처리
    const res = await fetch(`${ENGINE_API}/api/auth/naver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        naverId: naverUser.id,
        email: naverUser.email || '',
        nickname: naverUser.nickname || naverUser.name || '네이버사용자',
      }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Naver auth error:', error?.message || error);
    return NextResponse.json({ error: '네이버 로그인 처리 중 오류가 발생했습니다' }, { status: 500 });
  }
}
