'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import VoteButton from '@/components/forum/VoteButton';
import CommentSection from '@/components/forum/CommentSection';

const CATEGORY_MAP: Record<string, string> = {
  DOMESTIC: '국내증시', OVERSEAS: '해외증시', FOREX: '환율',
  CRYPTO: '암호화폐', REAL_ESTATE: '부동산', FREE: '자유',
};

interface PostDetail {
  id: string; userId: string; nickname: string; title: string;
  content: string; category: string; viewCount: number;
  likeCount: number; dislikeCount: number; commentCount: number;
  createdAt: string; updatedAt?: string;
}

export default function CommunityDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try { setCurrentUserId(JSON.parse(user).userId || JSON.parse(user).id); } catch {}
    }
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const res = await fetch(`/api/forum/posts/${id}`);
      if (res.ok) setPost(await res.json());
    } catch {}
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/forum/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) router.push('/forum/community');
    } catch {}
  };

  if (loading) return <DetailSkeleton />;
  if (!post) return <div className="text-center py-12 text-text-secondary">게시글을 찾을 수 없습니다</div>;

  const isAuthor = currentUserId && post.userId === currentUserId;

  return (
    <div>
      <Link href="/forum/community" className="text-xs text-text-secondary hover:text-accent mb-4 inline-block">
        ← 목록으로
      </Link>

      <div className="bg-card rounded-lg border border-border p-5 mb-4">
        <div className="flex items-center gap-2 mb-3 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue text-[10px]">
            {CATEGORY_MAP[post.category] || post.category}
          </span>
          <span className="text-accent font-medium">{post.nickname}</span>
          <span className="text-border">·</span>
          <span className="text-text-secondary">{formatDate(post.createdAt)}</span>
          <span className="text-text-secondary ml-auto">👁 {post.viewCount}</span>
        </div>

        <h1 className="text-lg font-bold text-text-primary mb-4">{post.title}</h1>
        <div className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed mb-4">
          {post.content}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <VoteButton postId={post.id} likeCount={post.likeCount} dislikeCount={post.dislikeCount} />
          {isAuthor && (
            <div className="flex gap-2">
              <button onClick={() => router.push(`/forum/community/write?edit=${post.id}`)}
                className="px-3 py-1.5 text-xs bg-card border border-border text-text-secondary rounded hover:text-text-primary">수정</button>
              <button onClick={handleDelete}
                className="px-3 py-1.5 text-xs bg-card border border-negative/30 text-negative rounded hover:opacity-80">삭제</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-5">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border p-5 animate-pulse">
      <div className="h-3 w-20 bg-border rounded mb-3" />
      <div className="h-6 w-3/4 bg-border rounded mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-border rounded" />
        <div className="h-3 w-5/6 bg-border rounded" />
        <div className="h-3 w-4/6 bg-border rounded" />
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
    + ' ' + d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}
