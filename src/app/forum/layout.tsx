import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ê²½ì œ?´ìŠ¤ - InvestBoard | ?¤ì‹œê°?ê²½ì œ ?´ìŠ¤ & ?¬ì ?¬ëŸ¼',
  description: 'êµ?‚´ì¦ì‹œ, ?´ì™¸ì¦ì‹œ, ?˜ìœ¨, ê¸ˆë¦¬, ?”í˜¸?”í ?¤ì‹œê°??´ìŠ¤. ?¬ì?ë“¤???œì¥ ?„ë§ê³?? ë¡ .',
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
