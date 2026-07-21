'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

interface Comment {
  id: string;
  username: string;
  content: string;
  createdAt: string;
}

interface Props {
  articleId: string;
  onCommentAdded?: () => void;
}

export default function NewsCommentSection({ articleId, onCommentAdded }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/news/${articleId}/comments?page=0&size=100`, { cache: 'no-store' });
      const data = await res.json();
      setComments(data?.content || []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const content = input.trim();
    if (!content || submitting) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('댓글 작성은 로그인이 필요합니다.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/news/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (res.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }
      if (!res.ok) throw new Error('댓글 등록 실패');

      setInput('');
      onCommentAdded?.();
      await loadComments();
    } catch {
      alert('댓글을 등록하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-border pt-6">
      <h2 className="mb-4 text-base font-bold">댓글 {comments.length.toLocaleString()}개</h2>

      <form onSubmit={handleSubmit} className="mb-5 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={1000}
          placeholder="기사에 대한 의견을 남겨보세요"
          className="min-w-0 flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
        >
          {submitting ? '등록 중' : '등록'}
        </button>
      </form>

      {loading ? (
        <p className="py-4 text-sm text-text-secondary">댓글을 불러오는 중입니다.</p>
      ) : comments.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-5 text-center text-sm text-text-secondary">
          첫 댓글을 남겨보세요.
        </p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-1 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-accent">{comment.username || '회원'}</span>
                <time className="text-[11px] text-text-secondary">{timeAgo(comment.createdAt)}</time>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-text-primary">
                {comment.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000));
  if (diff < 1) return '방금';
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}
