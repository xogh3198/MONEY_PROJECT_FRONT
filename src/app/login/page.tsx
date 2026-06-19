'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // ?�효??검??
    if (!email || !password) {
      setError('?�메?�과 비�?번호�??�력?�세??);
      return;
    }

    if (tab === 'register') {
      if (password.length < 6) {
        setError('비�?번호??6???�상?�어???�니??);
        return;
      }
      if (password !== confirmPassword) {
        setError('비�?번호가 ?�치?��? ?�습?�다');
        return;
      }
      if (!nickname.trim()) {
        setError('?�네?�을 ?�력?�세??);
        return;
      }
    }

    setLoading(true);

    const endpoint = tab === 'login' ? '/api/auth-login' : '/api/auth-register';
    const body = tab === 'login'
      ? { email, password }
      : { email, password, nickname };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || '처리???�패?�습?�다');
      } else if (tab === 'register') {
        // ?�원가???�공 ??로그????���??�환
        setTab('login');
        setError('');
        setConfirmPassword('');
        setNickname('');
        alert('?�원가?�이 ?�료?�었?�니?? 로그?�해주세??');
      } else {
        // 로그???�공
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/';
      }
    } catch {
      setError('?�버???�결?????�습?�다. ?�시 ???�시 ?�도?�주?�요.');
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '';
    const REDIRECT_URI = `${window.location.origin}/auth/kakao/callback`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleNaverLogin = () => {
    const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID || '';
    const REDIRECT_URI = `${window.location.origin}/auth/naver/callback`;
    const state = Math.random().toString(36).substring(2, 15);
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}`;
    window.location.href = naverAuthUrl;
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-accent">InvestBoard</Link>
          <p className="text-xs text-text-secondary mt-2">경제 뉴스 & 투자 커뮤니티</p>
        </div>

        {/* ??*/}
        <div className="flex mb-6 bg-card rounded-lg p-1 border border-border">
          <button onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${tab === 'login' ? 'bg-accent text-black' : 'text-text-secondary hover:text-text-primary'}`}>
            로그??
          </button>
          <button onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${tab === 'register' ? 'bg-accent text-black' : 'text-text-secondary hover:text-text-primary'}`}>
            ?�원가??
          </button>
        </div>

        {/* ??*/}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="text-[11px] text-text-secondary mb-1 block">?�네??/label>
              <input
                type="text"
                placeholder="?�네??(2???�상)"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] text-text-secondary mb-1 block">?�메??/label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[11px] text-text-secondary mb-1 block">비�?번호</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={tab === 'register' ? '6???�상' : '비�?번호'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent pr-14"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-[11px] hover:text-text-primary">
                {showPassword ? '?�기�? : '보기'}
              </button>
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="text-[11px] text-text-secondary mb-1 block">비�?번호 ?�인</label>
              <input
                type="password"
                placeholder="비�?번호 ?�입??
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 bg-card border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none ${
                  confirmPassword && confirmPassword !== password ? 'border-negative' : 'border-border focus:border-accent'
                }`}
              />
              {confirmPassword && confirmPassword !== password && (
                <p className="text-[11px] text-negative mt-1">비�?번호가 ?�치?��? ?�습?�다</p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-negative/10 border border-negative/20 rounded-lg px-3 py-2">
              <p className="text-negative text-sm">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-accent text-black font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition mt-2">
            {loading ? '처리 �?..' : tab === 'login' ? '로그?? : '?�원가??}
          </button>
        </form>

        {/* 구분??*/}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] text-text-secondary">?�는</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* ?�셜 로그??*/}
        <div className="space-y-2">
          <button onClick={handleKakaoLogin}
            className="w-full py-3 bg-[#FEE500] text-[#3C1E1E] font-medium rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 text-sm">
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#3C1E1E" d="M9 1C4.58 1 1 3.79 1 7.21c0 2.17 1.45 4.08 3.64 5.18-.16.57-.58 2.07-.67 2.39-.1.39.14.39.3.28.12-.08 1.94-1.32 2.73-1.86.64.09 1.3.14 1.99.14 4.42 0 8-2.79 8-6.21C17 3.79 13.42 1 9 1"/></svg>
            카카?�로 ?�작?�기
          </button>

          <button onClick={handleNaverLogin}
            className="w-full py-3 bg-[#03C75A] text-white font-medium rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 text-sm">
            <span className="font-bold text-base">N</span>
            ?�이버로 ?�작?�기
          </button>
        </div>

        <p className="text-center text-[11px] text-text-secondary mt-6">
          로그?????�용?��? �?개인?�보처리방침???�의?�니??
        </p>
      </div>
    </div>
  );
}
