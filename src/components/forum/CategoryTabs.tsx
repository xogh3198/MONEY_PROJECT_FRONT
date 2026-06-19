'use client';

export type ForumCategory = 'ALL' | 'DOMESTIC' | 'OVERSEAS' | 'FOREX' | 'CRYPTO' | 'REAL_ESTATE' | 'FREE';

const CATEGORIES: { value: ForumCategory; label: string }[] = [
  { value: 'ALL', label: '?„ì²´' },
  { value: 'DOMESTIC', label: '?‡°?‡· êµ?‚´ì¦ì‹œ' },
  { value: 'OVERSEAS', label: '?‡º?‡¸ ?´ì™¸ì¦ì‹œ' },
  { value: 'FOREX', label: '?’± ?˜ìœ¨' },
  { value: 'CRYPTO', label: '???”í˜¸?”í' },
  { value: 'REAL_ESTATE', label: '?  ë¶€?™ì‚°' },
  { value: 'FREE', label: '?’¬ ?ìœ ' },
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
