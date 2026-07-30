'use client';

import { useEffect, useMemo, useState } from 'react';
import { trackGrowthEvent } from '@/lib/growth-analytics';

const STORAGE_KEY = 'investboard_interest_topics_v1';
const TOPICS = [
  { value: 'DOMESTIC', label: '국내증시' },
  { value: 'OVERSEAS', label: '해외증시' },
  { value: 'FOREX', label: '환율' },
  { value: 'RATE', label: '금리' },
  { value: 'CRYPTO', label: '암호화폐' },
];

export default function InterestTopicSelector({ availableTopics }: { availableTopics: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as string[];
      const valid = stored.filter(value => TOPICS.some(topic => topic.value === value));
      setSelected(valid);
      if (valid.length > 0) {
        trackGrowthEvent('interest_topics_opened', { topic_count: valid.length });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const matched = useMemo(
    () => selected.filter(topic => availableTopics.includes(topic)).length,
    [availableTopics, selected],
  );

  const toggle = (value: string) => {
    setSaved(false);
    setSelected(current => current.includes(value)
      ? current.filter(topic => topic !== value)
      : [...current, value]);
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    setSaved(true);
    trackGrowthEvent('interest_topics_saved', {
      topic_count: selected.length,
    });
  };

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold text-accent">MY BRIEFING</p>
          <h2 className="mt-1 text-lg font-bold">다시 볼 관심 주제를 저장하세요.</h2>
          <p className="mt-1 text-xs leading-5 text-text-secondary">
            계정이나 이메일 없이 이 브라우저에만 저장됩니다.
            {selected.length > 0 && ` 오늘 브리핑에는 저장한 주제 ${matched}개가 포함됐습니다.`}
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-black disabled:opacity-50"
          disabled={selected.length === 0}
        >
          {saved ? '저장됨' : '관심 주제 저장'}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {TOPICS.map(topic => (
          <button
            key={topic.value}
            type="button"
            onClick={() => toggle(topic.value)}
            aria-pressed={selected.includes(topic.value)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              selected.includes(topic.value)
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </section>
  );
}
