'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/forum', label: '뉴스', icon: '📰' },
  { href: '/market', label: '시장', icon: '📊' },
  { href: '/calendar', label: '캘린더', icon: '📅' },
  { href: '/tools', label: '도구', icon: '🛠' },
  { href: '/dividend', label: '배당', icon: '💰' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // 페이지 전환 시 로그인 상태 재확인
  useEffect(() => {
    const stored = localStorage.getItem('user');
    setUser(stored ? JSON.parse(stored) : null);
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <>
      {/* 데스크톱 상단 네비 */}
      <header className="bg-card border-b border-border sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          <Link href="/" className="text-lg font-bold text-accent">MoneyForum</Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href}
                className={`px-3 py-1.5 rounded text-sm transition ${
                  pathname === item.href ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary'
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {!mounted ? (
              <div className="w-16 h-8" />
            ) : user ? (
              <>
                <span className="text-xs text-text-secondary">{user.nickname || user.email}</span>
                <button onClick={logout} className="text-xs text-text-secondary hover:text-negative">로그아웃</button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-1.5 bg-accent text-black text-sm font-medium rounded hover:opacity-90">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 모바일 상단 헤더 (간소화) */}
      <header className="bg-card border-b border-border sticky top-0 z-50 md:hidden">
        <div className="px-4 flex items-center justify-between h-11">
          <Link href="/" className="text-base font-bold text-accent">MoneyForum</Link>
          {!mounted ? null : user ? (
            <button onClick={logout} className="text-xs text-text-secondary">로그아웃</button>
          ) : (
            <Link href="/login" className="text-xs text-accent font-medium">로그인</Link>
          )}
        </div>
      </header>

      {/* 모바일 하단 탭바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around py-1.5">
          {NAV_ITEMS.slice(0, 5).map(item => (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center py-1 px-2 ${
                pathname === item.href ? 'text-accent' : 'text-text-secondary'
              }`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
