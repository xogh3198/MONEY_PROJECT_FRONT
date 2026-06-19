'use client';
import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  parentCommentId?: string | null;
  createdAt: string;
}

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadComments(); }, [postId]);

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments?size=100`);
      const data = await res.json();
      setComments(data?.content || data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const submitComment = async (content: string, parentCommentId?: string | null) => {
    const token = localStorage.getItem('token');
    if (!token) { alert('로그인이 필요합니다'); return; }
    if (!content.trim()) return;
    try {
      const res = await fetch(`/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content, parentCommentId }),
      });
      if (res.ok) { loadComments(); }
    } catch { /* ignore */ }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitComment(input);
    setInput('');
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    submitComment(replyInput, replyTo);
    setReplyInput('');
    setReplyTo(null);
  };

  const topComments = comments.filter((c) => !c.parentCommentId);
  const replies = (parentId: string) => comments.filter((c) => c.parentCommentId === parentId);

  if (loading) return <div className="py-4 text-text-secondary text-sm animate-pulse">댓글 불러오는 중...</div>;

  return (
    <div className="pt-4">
      <h4 className="text-sm font-bold text-text-primary mb-3">댓글 {comments.length}개</h4>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="의견을 남겨보세요..." maxLength={1000}
          className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-card text-text-primary focus:outline-none focus:border-accent"
        />
        <button type="submit" className="px-4 py-2 text-sm font-medium text-black bg-accent rounded-md hover:opacity-90">
          등록
        </button>
      </form>
      <div className="space-y-2">
        {topComments.map((c) => (
          <CommentItem key={c.id} comment={c} replies={replies(c.id)}
            replyTo={replyTo} setReplyTo={setReplyTo}
            replyInput={replyInput} setReplyInput={setReplyInput}
            handleReply={handleReply}
          />
        ))}
      </div>
    </div>
  );
}

function CommentItem({ comment, replies, replyTo, setReplyTo, replyInput, setReplyInput, handleReply }: {
  comment: Comment; replies: Comment[];
  replyTo: string | null; setReplyTo: (v: string | null) => void;
  replyInput: string; setReplyInput: (v: string) => void;
  handleReply: (e: React.FormEvent) => void;
}) {
  return (
    <div>
      <div className="bg-card rounded-md p-3 border border-border">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-accent">{comment.username}</span>
          <span className="text-xs text-text-secondary">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-text-primary">{comment.content}</p>
        <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
          className="text-[11px] text-text-secondary mt-1 hover:text-accent">답글</button>
      </div>
      {replyTo === comment.id && (
        <form onSubmit={handleReply} className="flex gap-2 mt-1 ml-4">
          <input type="text" value={replyInput} onChange={(e) => setReplyInput(e.target.value)}
            placeholder="답글 입력..." maxLength={1000}
            className="flex-1 px-3 py-1.5 text-xs border border-border rounded bg-card text-text-primary focus:outline-none focus:border-accent" />
          <button type="submit" className="px-3 py-1.5 text-xs font-medium text-black bg-accent rounded hover:opacity-90">등록</button>
        </form>
      )}
      {replies.length > 0 && (
        <div className="ml-4 mt-1 space-y-1">
          {replies.map((r) => (
            <div key={r.id} className="bg-card/50 rounded-md p-2.5 border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-accent">{r.username}</span>
                <span className="text-[10px] text-text-secondary">{timeAgo(r.createdAt)}</span>
              </div>
              <p className="text-xs text-text-primary">{r.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return '방금';
  if (diff < 60) return `${diff}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}
