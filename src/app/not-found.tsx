import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-6xl mb-4">?”</div>
      <h1 className="text-2xl font-bold mb-2">?˜ì´ì§€ë¥?ì°¾ì„ ???†ìŠµ?ˆë‹¤</h1>
      <p className="text-text-secondary mb-6">?”ì²­?˜ì‹  ?˜ì´ì§€ê°€ ì¡´ì¬?˜ì? ?Šê±°???´ë™?˜ì—ˆ?µë‹ˆ??</p>
      <div className="flex gap-3">
        <Link href="/" className="px-5 py-2.5 bg-accent text-black font-medium rounded-lg hover:opacity-90">
          ?ˆìœ¼ë¡?
        </Link>
        <Link href="/forum" className="px-5 py-2.5 bg-card border border-border text-text-primary font-medium rounded-lg hover:border-accent/30">
          ?´ìŠ¤ ë³´ê¸°
        </Link>
      </div>
    </div>
  );
}
