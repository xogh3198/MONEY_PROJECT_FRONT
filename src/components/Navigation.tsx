'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: '홈' },
  { href: '/forum', label: '경제뉴스' },
  { href: '/market', label: '시장지표' },
  { href: '/calendar', label: '캘린더' },
  { href: '/dividend', label: '배당관리' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
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
          {user ? (
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
  );
}
