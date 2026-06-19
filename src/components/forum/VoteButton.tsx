'use client';
import { useState } from 'react';

interface Props {
  postId: string;
  likeCount: number;
  dislikeCount: number;
  userVote?: 'LIKE' | 'DISLIKE' | null;
}

export default function VoteButton({ postId, likeCount, dislikeCount, userVote: initialVote }: Props) {
  const [likes, setLikes] = useState(likeCount);
  const [dislikes, setDislikes] = useState(dislikeCount);
  const [userVote, setUserVote] = useState<'LIKE' | 'DISLIKE' | null>(initialVote || null);
  const [loading, setLoading] = useState(false);

  const handleVote = async (voteType: 'LIKE' | 'DISLIKE') => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Î°úÍ∑∏?∏Ïù¥ ?ÑÏöî?©Îãà??);
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/forum/posts/${postId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ voteType }),
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likeCount);
        setDislikes(data.dislikeCount);
        setUserVote(data.userVote || null);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleVote('LIKE')}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition ${
          userVote === 'LIKE'
            ? 'bg-accent/20 text-accent border border-accent/30'
            : 'bg-card border border-border text-text-secondary hover:text-text-primary'
        }`}
      >
        ?ëç {likes}
      </button>
      <button
        onClick={() => handleVote('DISLIKE')}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition ${
          userVote === 'DISLIKE'
            ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
            : 'bg-card border border-border text-text-secondary hover:text-text-primary'
        }`}
      >
        ?ëé {dislikes}
      </button>
    </div>
  );
}
