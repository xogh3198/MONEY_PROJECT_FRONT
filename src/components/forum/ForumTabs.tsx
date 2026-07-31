'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { key: 'news', label: '📰 뉴스', path: '/forum' },
  { key: 'community', label: '💬 커뮤니티', path: '/forum/community' },
  { key: 'search', label: '🔎 뉴스 검색', path: '/search' },
] as const;

export default function ForumTabs() {
  const pathname = usePathname();

  const activeTab = pathname.startsWith('/forum/community')
    ? 'community'
    : pathname === '/search'
      ? 'search'
      : 'news';

  return (
    <div className="flex gap-1 mb-5">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.path}
          aria-current={activeTab === tab.key ? 'page' : undefined}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === tab.key
              ? 'bg-accent text-black'
              : 'bg-card border border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
