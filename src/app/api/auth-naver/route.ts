import { NextRequest, NextResponse } from 'next/server';

const ENGINE_API = process.env.NEXT_PUBLIC_ENGINE_API_URL || 'http://15.164.171.43:8080';
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID || '';
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET || '';

export async function POST(request: NextRequest) {
  const { code, state } = await request.json();

  if (!code) {
    return NextResponse.json({ error: '?¸ì¦ ì½”ë“œê°€ ?†ìŠµ?ˆë‹¤' }, { status: 400 });
  }

  try {
    // 1. ?¤ì´ë²„ì—??access_token ë°œê¸‰
    const tokenUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${NAVER_CLIENT_ID}&client_secret=${NAVER_CLIENT_SECRET}&code=${code}&state=${state}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error('Naver token error:', tokenData);
      return NextResponse.json({ error: '?¤ì´ë²??¸ì¦???¤íŒ¨?ˆìŠµ?ˆë‹¤' }, { status: 401 });
    }

    // 2. ?¤ì´ë²??¬ìš©???„ë¡œ??ì¡°íšŒ
    const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profileData = await profileRes.json();

    if (profileData.resultcode !== '00') {
      return NextResponse.json({ error: '?„ë¡œ??ì¡°íšŒ???¤íŒ¨?ˆìŠµ?ˆë‹¤' }, { status: 401 });
    }

    const naverUser = profileData.response;
    // naverUser: { id, nickname, email, name, ... }

    // 3. ë°±ì—”?œì— ?¤ì´ë²??¬ìš©???•ë³´ ?„ë‹¬?˜ì—¬ ë¡œê·¸???Œì›ê°€??ì²˜ë¦¬
    const res = await fetch(`${ENGINE_API}/api/auth/naver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        naverId: naverUser.id,
        email: naverUser.email || '',
        nickname: naverUser.nickname || naverUser.name || '?¤ì´ë²„ì‚¬?©ì',
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Backend naver auth error:', res.status, errorText);
      return NextResponse.json({ error: `ë°±ì—”???¸ì¦ ?¤íŒ¨ (${res.status})` }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Naver auth error:', error?.message || error);
    return NextResponse.json({ error: '?¤ì´ë²?ë¡œê·¸??ì²˜ë¦¬ ì¤??¤ë¥˜ê°€ ë°œìƒ?ˆìŠµ?ˆë‹¤' }, { status: 500 });
  }
}
