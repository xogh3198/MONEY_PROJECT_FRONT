'use client';
import Link from 'next/link';

const CATEGORY_MAP: Record<string, string> = {
  DOMESTIC: 'êµ?‚´ì¦ì‹œ',
  OVERSEAS: '?´ì™¸ì¦ì‹œ',
  FOREX: '?˜ìœ¨',
  CRYPTO: '?”í˜¸?”í',
  REAL_ESTATE: 'ë¶€?™ì‚°',
  FREE: '?ìœ ',
};

export interface ForumPost {
  id: string;
  userId: string;
  nickname: string;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return 'ë°©ê¸ˆ';
  if (diff < 60) return `${diff}ë¶???;
  if (diff < 1440) return `${Math.floor(diff / 60)}?œê°„ ??;
  return `${Math.floor(diff / 1440)}????;
}

export default function PostCard({ post }: { post: ForumPost }) {
  return (
    <Link href={`/forum/community/${post.id}`}>
      <div className="px-5 py-4 hover:bg-[#1c2129] transition cursor-pointer">
        <div className="flex items-center gap-2 mb-2 text-[11px]">
          <span className="text-accent font-medium">{post.nickname}</span>
          <span className="text-border">Â·</span>
          <span className="text-text-secondary">{timeAgo(post.createdAt)}</span>
          <span className={`ml-auto px-2 py-0.5 rounded text-[10px] bg-accent-blue/10 text-accent-blue`}>
            {CATEGORY_MAP[post.category] || post.category}
          </span>
        </div>
        <h3 className="text-[14px] font-semibold text-text-primary mb-2 leading-snug line-clamp-1">
          {post.title}
        </h3>
        <div className="flex items-center gap-4 text-[11px] text-text-secondary">
          <span>?‘ {post.viewCount}</span>
          <span>?‘ {post.likeCount}</span>
          <span>?’¬ {post.commentCount}</span>
        </div>
      </div>
    </Link>
  );
}
