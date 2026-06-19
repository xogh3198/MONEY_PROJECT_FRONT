'use client';
import { usePathname, useRouter } from 'next/navigation';

const TABS = [
  { key: 'news', label: '📰 뉴스', path: '/forum' },
  { key: 'community', label: '💬 커뮤니티', path: '/forum/community' },
] as const;

export default function ForumTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname.startsWith('/forum/community') ? 'community' : 'news';

  return (
    <div className="flex gap-1 mb-5">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => router.push(tab.path)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === tab.key
              ? 'bg-accent text-black'
              : 'bg-card border border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
