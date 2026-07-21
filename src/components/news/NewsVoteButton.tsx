'use client';

import { useState } from 'react';

interface Props {
  articleId: string;
  positiveVotes: number;
  negativeVotes: number;
  onChange?: (positiveVotes: number, negativeVotes: number) => void;
}

export default function NewsVoteButton({
  articleId,
  positiveVotes,
  negativeVotes,
  onChange,
}: Props) {
  const [likes, setLikes] = useState(positiveVotes);
  const [dislikes, setDislikes] = useState(negativeVotes);
  const [userVote, setUserVote] = useState<'LIKE' | 'DISLIKE' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType: 'LIKE' | 'DISLIKE') => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인 후 의견을 표시할 수 있습니다.');
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/news/${articleId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });

      if (res.status === 401) {
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        return;
      }
      if (!res.ok) throw new Error('투표 요청 실패');

      const data = await res.json();
      const nextLikes = Number(data.positiveVotes || 0);
      const nextDislikes = Number(data.negativeVotes || 0);
      setLikes(nextLikes);
      setDislikes(nextDislikes);
      setUserVote(data.userVote || null);
      onChange?.(nextLikes, nextDislikes);
    } catch {
      alert('의견을 반영하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleVote('LIKE')}
        disabled={loading}
        className={`rounded-lg border px-4 py-2 text-sm transition ${
          userVote === 'LIKE'
            ? 'border-[#f85149]/40 bg-[#f85149]/15 text-[#f85149]'
            : 'border-border bg-card text-text-secondary hover:text-text-primary'
        }`}
      >
        👍 좋아요 {likes.toLocaleString()}
      </button>
      <button
        type="button"
        onClick={() => handleVote('DISLIKE')}
        disabled={loading}
        className={`rounded-lg border px-4 py-2 text-sm transition ${
          userVote === 'DISLIKE'
            ? 'border-[#58a6ff]/40 bg-[#58a6ff]/15 text-[#58a6ff]'
            : 'border-border bg-card text-text-secondary hover:text-text-primary'
        }`}
      >
        👎 싫어요 {dislikes.toLocaleString()}
      </button>
    </div>
  );
}
