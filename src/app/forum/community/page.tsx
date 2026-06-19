'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ForumTabs from '@/components/forum/ForumTabs';
import CategoryTabs, { ForumCategory } from '@/components/forum/CategoryTabs';
import PostCard, { ForumPost } from '@/components/forum/PostCard';

type SortType = 'latest' | 'popular';

export default function CommunityListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [category, setCategory] = useState<ForumCategory>('ALL');
  const [sort, setSort] = useState<SortType>('latest');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(0);
    setPosts([]);
    loadPosts(0);
  }, [category, sort]);

  const loadPosts = async (pageNum: number) => {
    setLoading(true);
    try {
      if (sort === 'popular') {
        const params = category !== 'ALL' ? `?category=${category}` : '';
        const res = await fetch(`/api/forum/posts/popular${params}`);
        const data = await res.json();
        const items = Array.isArray(data) ? data.map((d: any) => d.post || d) : [];
        setPosts(items);
        setHasMore(false);
      } else {
        const params = new URLSearchParams({ page: String(pageNum), size: '10', sort: 'createdAt,desc' });
        if (category !== 'ALL') params.set('category', category);
        const res = await fetch(`/api/forum/posts?${params}`);
        const data = await res.json();
        const content = data?.content || [];
        if (pageNum === 0) setPosts(content);
        else setPosts((prev) => [...prev, ...content]);
        setHasMore(!data?.last);
      }
    } catch { if (pageNum === 0) setPosts([]); }
    finally { setLoading(false); }
  };

  const handleWrite = () => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    router.push('/forum/community/write');
  };

  return (
    <div>
      <ForumTabs />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">커뮤니티</h1>
        <button onClick={handleWrite}
          className="px-4 py-2 bg-accent text-black text-sm font-medium rounded-lg hover:opacity-90">
          ✏️ 글쓰기
        </button>
      </div>

      <CategoryTabs selected={category} onChange={setCategory} />

      {/* Sort toggle */}
      <div className="flex gap-1 mb-4">
        <button onClick={() => setSort('popular')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition ${
            sort === 'popular' ? 'bg-accent text-black' : 'bg-card border border-border text-text-secondary hover:text-text-primary'
          }`}>🔥 인기</button>
        <button onClick={() => setSort('latest')}
          className={`px-3 py-1.5 rounded text-xs font-medium transition ${
            sort === 'latest' ? 'bg-accent text-black' : 'bg-card border border-border text-text-secondary hover:text-text-primary'
          }`}>⚡ 최신</button>
      </div>

      {/* Post list */}
      {loading && posts.length === 0 ? (
        <PostListSkeleton />
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-text-secondary text-sm">게시글이 없습니다</div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden divide-y divide-border/50">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {sort === 'latest' && hasMore && !loading && posts.length > 0 && (
        <div className="text-center mt-4">
          <button onClick={() => { const next = page + 1; setPage(next); loadPosts(next); }}
            className="px-6 py-2 bg-card border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition">
            더보기
          </button>
        </div>
      )}
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden divide-y divide-border/50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-5 py-4 animate-pulse">
          <div className="flex gap-2 mb-2">
            <div className="h-3 w-16 bg-border rounded" />
            <div className="h-3 w-12 bg-border rounded" />
          </div>
          <div className="h-4 w-4/5 bg-border rounded mb-2" />
          <div className="flex gap-3">
            <div className="h-3 w-10 bg-border rounded" />
            <div className="h-3 w-10 bg-border rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
