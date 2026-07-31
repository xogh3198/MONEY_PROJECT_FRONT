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
  const [error, setError] = useState('');

  useEffect(() => {
    setPage(0);
    setPosts([]);
    loadPosts(0);
  }, [category, sort]);

  const loadPosts = async (pageNum: number) => {
    setLoading(true);
    setError('');
    try {
      if (sort === 'popular') {
        const params = category !== 'ALL' ? `?category=${category}` : '';
        const res = await fetch(`/api/forum/posts/popular${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || '인기 게시글을 불러오지 못했습니다.');
        const items = Array.isArray(data) ? data.map((d: any) => d.post || d) : [];
        setPosts(items);
        setHasMore(false);
      } else {
        const params = new URLSearchParams({ page: String(pageNum), size: '10', sort: 'createdAt,desc' });
        if (category !== 'ALL') params.set('category', category);
        const res = await fetch(`/api/forum/posts?${params}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || '게시글을 불러오지 못했습니다.');
        const content = data?.content || [];
        if (pageNum === 0) setPosts(content);
        else setPosts((prev) => [...prev, ...content]);
        setHasMore(!data?.last);
      }
    } catch (loadError) {
      if (pageNum === 0) setPosts([]);
      setError(loadError instanceof Error ? loadError.message : '게시글을 불러오지 못했습니다.');
    }
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
      ) : error ? (
        <div className="rounded-lg border border-negative/30 bg-negative/10 px-5 py-10 text-center">
          <p className="text-sm text-negative">{error}</p>
          <button
            type="button"
            onClick={() => loadPosts(0)}
            className="mt-4 rounded-lg border border-border bg-card px-4 py-2 text-sm hover:border-accent"
          >
            다시 연결
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-border bg-card px-5 py-12 text-center">
          <p className="text-sm font-medium text-text-primary">아직 첫 토론이 시작되지 않았습니다.</p>
          <p className="mt-2 text-xs text-text-secondary">API는 정상 연결되어 있습니다. 궁금한 시장 이슈로 첫 글을 남겨보세요.</p>
          <button
            type="button"
            onClick={handleWrite}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-black"
          >
            첫 글 작성하기
          </button>
        </div>
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
