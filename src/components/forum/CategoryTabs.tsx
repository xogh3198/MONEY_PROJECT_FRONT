'use client';

export type ForumCategory = 'ALL' | 'DOMESTIC' | 'OVERSEAS' | 'FOREX' | 'CRYPTO' | 'REAL_ESTATE' | 'FREE';

const CATEGORIES: { value: ForumCategory; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'DOMESTIC', label: '🇰🇷 국내증시' },
  { value: 'OVERSEAS', label: '🇺🇸 해외증시' },
  { value: 'FOREX', label: '💱 환율' },
  { value: 'CRYPTO', label: '₿ 암호화폐' },
  { value: 'REAL_ESTATE', label: '🏠 부동산' },
  { value: 'FREE', label: '💬 자유' },
];

interface Props {
  selected: ForumCategory;
  onChange: (cat: ForumCategory) => void;
}

export default function CategoryTabs({ selected, onChange }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-4">
      {CATEGORIES.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition ${
            selected === c.value
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
              : 'bg-card border border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
