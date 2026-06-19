'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/', label: '??, icon: '? ' },
  { href: '/forum', label: '?´ìŠ¤', icon: '?“°' },
  { href: '/market', label: '?œì¥', icon: '?“Š' },
  { href: '/calendar', label: 'ìº˜ë¦°??, icon: '?“…' },
  { href: '/tools', label: '?„êµ¬', icon: '?› ' },
  { href: '/dividend', label: 'ë°°ë‹¹', icon: '?’°' },
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

  // ?˜ì´ì§€ ?„í™˜ ??ë¡œê·¸???íƒœ ?¬í™•??
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
      {/* ?°ìŠ¤?¬í†± ?ë‹¨ ?¤ë¹„ */}
      <header className="bg-card border-b border-border sticky top-0 z-50 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
          <Link href="/" className="text-lg font-bold text-accent">InvestBoard</Link>

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
                <button onClick={logout} className="text-xs text-text-secondary hover:text-negative">ë¡œê·¸?„ì›ƒ</button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-1.5 bg-accent text-black text-sm font-medium rounded hover:opacity-90">
                ë¡œê·¸??
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ëª¨ë°”???ë‹¨ ?¤ë” (ê°„ì†Œ?? */}
      <header className="bg-card border-b border-border sticky top-0 z-50 md:hidden">
        <div className="px-4 flex items-center justify-between h-11">
          <Link href="/" className="text-base font-bold text-accent">InvestBoard</Link>
          {!mounted ? null : user ? (
            <button onClick={logout} className="text-xs text-text-secondary">ë¡œê·¸?„ì›ƒ</button>
          ) : (
            <Link href="/login" className="text-xs text-accent font-medium">ë¡œê·¸??/Link>
          )}
        </div>
      </header>

      {/* ëª¨ë°”???˜ë‹¨ ??°” */}
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
