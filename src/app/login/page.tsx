'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
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

      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('서버 연결에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // TODO: 카카오 OAuth URL로 리다이렉트
    alert('카카오 로그인은 카카오 앱 등록 후 사용 가능합니다');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8 text-accent">MoneyForum</h1>

        {/* 탭 */}
        <div className="flex mb-6 bg-card rounded-lg p-1">
          <button onClick={() => setTab('login')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${tab === 'login' ? 'bg-accent text-black' : 'text-text-secondary'}`}>
            로그인
          </button>
          <button onClick={() => setTab('register')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${tab === 'register' ? 'bg-accent text-black' : 'text-text-secondary'}`}>
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
            />
          )}
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="비밀번호"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-xs">
              {showPassword ? '숨기기' : '보기'}
            </button>
          </div>

          {error && <p className="text-negative text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-accent text-black font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition">
            {loading ? '처리 중...' : tab === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        {/* 카카오 로그인 */}
        <button onClick={handleKakaoLogin}
          className="w-full mt-3 py-3 bg-[#FEE500] text-[#3C1E1E] font-medium rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2">
          <span>💬</span> 카카오로 시작하기
        </button>

        <p className="text-center text-xs text-text-secondary mt-6">
          관리자: admin@money.com / admin1234
        </p>
      </div>
    </div>
  );
}
