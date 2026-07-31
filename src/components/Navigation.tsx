'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/', activePath: '/', label: '홈', icon: '⌂', ariaLabel: 'InvestBoard 통합 홈' },
  {
    href: '/forum?utm_source=investingboard-nav&utm_medium=internal&utm_campaign=product-navigation',
    activePath: '/forum',
    label: 'InvestingBoard',
    icon: '▤',
    ariaLabel: 'InvestingBoard 금융 홈',
  },
  {
    href: '/promotion-map?utm_source=investingboard-nav&utm_medium=internal&utm_campaign=product-navigation',
    activePath: '/promotion-map',
    label: '마케팅맵',
    icon: '↗',
    ariaLabel: '마케팅맵 홍보 홈',
  },
];

const MOBILE_NAV_ITEMS = NAV_ITEMS;

const INVESTING_NAV_ITEMS = [
  { href: '/forum', label: '뉴스', match: 'exact' },
  { href: '/market', label: '시장', match: 'prefix' },
  { href: '/search', label: '뉴스 검색', match: 'prefix' },
  { href: '/briefing', label: '오늘의 브리핑', match: 'prefix' },
  { href: '/tools', label: '계산 도구', match: 'prefix' },
  { href: '/dividend', label: '배당 관리', match: 'prefix' },
  { href: '/forum/community', label: '커뮤니티', match: 'prefix' },
] as const;

const INVESTING_PATHS = [
  '/forum',
  '/market',
  '/search',
  '/briefing',
  '/guides',
  '/tools',
  '/dividend',
  '/calendar',
  '/methodology',
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
    window.location.href = '/forum';
  };

  return (
    <>
      {/* 데스크톱 상단 네비 */}
      <header className="bg-card border-b border-border sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          <Link
            href="/forum"
            aria-label="InvestingBoard 홈"
            className="text-lg font-bold text-accent"
          >
            InvestingBoard
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link key={item.href} href={item.href}
                aria-label={item.ariaLabel}
                aria-current={isPrimaryActive(pathname, item.activePath) ? 'page' : undefined}
                className={`px-3 py-1.5 rounded text-sm transition ${
                  isPrimaryActive(pathname, item.activePath) ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary'
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
        <nav
          aria-label="InvestingBoard 기능"
          className="border-t border-border/60 bg-bg/40"
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 h-9">
            {INVESTING_NAV_ITEMS.map(item => {
              const active = isSecondaryActive(pathname, item.href, item.match === 'exact');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-1 rounded text-xs transition ${
                    active ? 'text-text-primary bg-border/60' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* 모바일 상단 헤더 */}
      <header className="bg-card border-b border-border sticky top-0 z-50 md:hidden">
        <div className="px-4 flex items-center justify-between h-11">
          <Link href="/forum" aria-label="InvestingBoard 홈" className="text-base font-bold text-accent">
            InvestingBoard
          </Link>
          {!mounted ? null : user ? (
            <button onClick={logout} className="text-xs text-text-secondary">로그아웃</button>
          ) : (
            <Link href="/login" className="text-xs text-accent font-medium">로그인</Link>
          )}
        </div>
        <nav aria-label="InvestingBoard 기능" className="flex gap-1 overflow-x-auto border-t border-border/60 px-3 py-1.5">
          {INVESTING_NAV_ITEMS.map(item => {
            const active = isSecondaryActive(pathname, item.href, item.match === 'exact');
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`shrink-0 rounded px-2.5 py-1 text-[11px] ${
                  active ? 'bg-border/70 text-text-primary' : 'text-text-secondary'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* 모바일 하단 탭바 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around py-1.5">
          {MOBILE_NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isPrimaryActive(pathname, item.activePath) ? 'page' : undefined}
              className={`flex flex-col items-center py-1 px-2 ${
                isPrimaryActive(pathname, item.activePath) ? 'text-accent' : 'text-text-secondary'
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

function isPrimaryActive(pathname: string, activePath: string): boolean {
  if (activePath === '/') return pathname === '/';
  if (activePath === '/promotion-map') {
    return pathname === '/promotion-map' || pathname.startsWith('/promotion-map/');
  }
  return INVESTING_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));
}

function isSecondaryActive(pathname: string, href: string, exact = false): boolean {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}
