import Link from 'next/link';

const LINKS = [
  { href: '/briefing', label: '오늘의 브리핑' },
  { href: '/guides', label: '금융 가이드' },
  { href: '/methodology', label: '데이터·편집 원칙' },
  { href: '/feed.xml', label: 'RSS' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-bold text-text-primary">InvestBoard</p>
            <p className="mt-1 max-w-xl text-xs leading-5 text-text-secondary">
              공개 데이터와 원문 출처를 바탕으로 금융 이슈를 설명합니다. 제공 정보는 일반적인 교육·정보 목적이며 개인별 투자 자문이 아닙니다.
            </p>
          </div>
          <nav aria-label="푸터" className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-secondary">
            {LINKS.map(link => (
              <Link key={link.href} href={link.href} className="hover:text-accent">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
