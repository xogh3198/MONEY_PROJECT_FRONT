import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-6xl mb-4">🔍</div>
      <h1 className="text-2xl font-bold mb-2">페이지를 찾을 수 없습니다</h1>
      <p className="text-text-secondary mb-6">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <div className="flex gap-3">
        <Link href="/" className="px-5 py-2.5 bg-accent text-black font-medium rounded-lg hover:opacity-90">
          홈으로
        </Link>
        <Link href="/forum" className="px-5 py-2.5 bg-card border border-border text-text-primary font-medium rounded-lg hover:border-accent/30">
          뉴스 보기
        </Link>
      </div>
    </div>
  );
}
