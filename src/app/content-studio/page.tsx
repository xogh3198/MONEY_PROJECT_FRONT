'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  ContentOpportunity,
  ContentScriptDraft,
} from '@/lib/content-studio';

const STORAGE_KEY = 'investboard_content_studio_key';

export default function ContentStudioPage() {
  const [accessKey, setAccessKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [opportunities, setOpportunities] = useState<ContentOpportunity[]>([]);
  const [selected, setSelected] = useState<ContentOpportunity | null>(null);
  const [draft, setDraft] = useState<ContentScriptDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || '';
    if (saved) {
      setAccessKey(saved);
      setKeyInput(saved);
      void loadOpportunities(saved);
    }
  }, []);

  const authenticate = (event: FormEvent) => {
    event.preventDefault();
    const nextKey = keyInput.trim();
    if (!nextKey) return;
    localStorage.setItem(STORAGE_KEY, nextKey);
    setAccessKey(nextKey);
    void loadOpportunities(nextKey);
  };

  const loadOpportunities = async (key = accessKey) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/content-studio/opportunities?limit=12', {
        cache: 'no-store',
        headers: { 'x-content-studio-key': key },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '후보를 불러오지 못했습니다.');
      setOpportunities(data.opportunities || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '후보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const createDraft = async (opportunity: ContentOpportunity) => {
    setSelected(opportunity);
    setDraft(null);
    setDraftLoading(true);
    setError('');
    try {
      const response = await fetch('/api/content-studio/script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-content-studio-key': accessKey,
        },
        body: JSON.stringify({ opportunity }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '초안을 생성하지 못했습니다.');
      setDraft(data.draft);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '초안을 생성하지 못했습니다.');
    } finally {
      setDraftLoading(false);
    }
  };

  const disconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAccessKey('');
    setKeyInput('');
    setOpportunities([]);
    setSelected(null);
    setDraft(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      <section className="bg-card border border-border rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-accent mb-2">INTERNAL · NOINDEX</div>
            <h1 className="text-2xl font-bold">콘텐츠 기회 스튜디오</h1>
            <p className="text-sm text-text-secondary mt-2 max-w-2xl leading-relaxed">
              최신 뉴스와 시장지표에서 금융 관련성이 높은 주제를 찾고, 출처·검수 항목이 포함된
              45~60초 쇼츠 초안을 만듭니다. 이 화면은 게시기가 아니라 검수 전 초안 도구입니다.
            </p>
          </div>
          {accessKey && (
            <button onClick={disconnect} className="text-xs text-text-secondary hover:text-text-primary">
              접근 키 지우기
            </button>
          )}
        </div>

        {!accessKey ? (
          <form onSubmit={authenticate} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-xl">
            <input
              type="password"
              value={keyInput}
              onChange={event => setKeyInput(event.target.value)}
              placeholder="CONTENT_STUDIO_ACCESS_KEY"
              autoComplete="current-password"
              className="flex-1 bg-[#0d1117] border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button className="bg-accent text-black font-semibold rounded-lg px-4 py-2 text-sm">
              스튜디오 열기
            </button>
          </form>
        ) : (
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => void loadOpportunities()}
              disabled={loading}
              className="bg-accent text-black font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50"
            >
              {loading ? '신호 분석 중…' : '최신 후보 다시 분석'}
            </button>
            <span className="text-xs text-text-secondary">외부 게시·광고 집행 없음</span>
          </div>
        )}
      </section>

      {error && (
        <div className="bg-[#f85149]/10 border border-[#f85149]/40 text-[#ff7b72] rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {accessKey && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] gap-6">
          <section className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-bold">제작 후보</h2>
                <p className="text-xs text-text-secondary mt-1">점수는 관심도의 확정값이 아닌 탐색 우선순위입니다.</p>
              </div>
              <span className="text-xs text-text-secondary">{opportunities.length}개</span>
            </div>

            {loading && opportunities.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center text-text-secondary">
                뉴스·시장 신호를 분석하고 있습니다…
              </div>
            ) : opportunities.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-8 text-center text-text-secondary">
                금융 관련성이 충분한 후보가 없습니다. 잠시 후 다시 분석해보세요.
              </div>
            ) : opportunities.map(opportunity => (
              <article
                key={opportunity.id}
                className={`bg-card border rounded-xl p-4 transition ${
                  selected?.id === opportunity.id ? 'border-accent' : 'border-border hover:border-text-secondary'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex flex-col items-center justify-center flex-shrink-0">
                    <strong className="text-lg leading-none">{opportunity.trendScore}</strong>
                    <span className="text-[9px] mt-1">SCORE</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex gap-2 text-[10px] text-text-secondary mb-1">
                      <span>{opportunity.category}</span>
                      <span>·</span>
                      <span>{opportunity.sourceName}</span>
                    </div>
                    <h3 className="font-semibold leading-snug">{opportunity.title}</h3>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">{opportunity.angle}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {opportunity.signals.map(signal => (
                    <span key={signal} className="text-[10px] bg-[#0d1117] border border-border rounded-full px-2 py-1">
                      {signal}
                    </span>
                  ))}
                </div>

                {opportunity.riskFlags.length > 0 && (
                  <div className="mt-3 text-[11px] text-[#d29922]">
                    검수: {opportunity.riskFlags.join(' · ')}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between gap-3">
                  {opportunity.sourceUrl ? (
                    <a
                      href={opportunity.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-blue hover:underline"
                    >
                      원문 확인
                    </a>
                  ) : <span />}
                  <button
                    onClick={() => void createDraft(opportunity)}
                    disabled={draftLoading}
                    className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 rounded-lg px-3 py-2 text-xs font-semibold"
                  >
                    이 주제로 초안 생성
                  </button>
                </div>
              </article>
            ))}
          </section>

          <section className="xl:sticky xl:top-16 xl:self-start">
            <DraftPanel draft={draft} loading={draftLoading} selected={selected} />
          </section>
        </div>
      )}
    </div>
  );
}

function DraftPanel({
  draft,
  loading,
  selected,
}: {
  draft: ContentScriptDraft | null;
  loading: boolean;
  selected: ContentOpportunity | null;
}) {
  const copyDraft = async () => {
    if (!draft) return;
    await navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="text-lg mb-2">🤖</div>
        <div className="font-semibold">검수 가능한 초안을 만들고 있습니다.</div>
        <div className="text-xs text-text-secondary mt-2">출처, 장면, 금융 고지까지 구조화합니다.</div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-text-secondary">
        <div className="text-2xl mb-3">🎬</div>
        <div className="text-sm">후보를 선택하면 쇼츠 초안이 여기에 표시됩니다.</div>
        {selected && <div className="text-xs mt-2">선택됨: {selected.title}</div>}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-semibold text-[#d29922]">DRAFT · HUMAN REVIEW REQUIRED</span>
            <h2 className="text-lg font-bold mt-1">{draft.title}</h2>
          </div>
          <button onClick={() => void copyDraft()} className="text-xs text-accent-blue hover:underline flex-shrink-0">
            JSON 복사
          </button>
        </div>
        <p className="mt-3 bg-accent/10 border border-accent/20 rounded-lg px-3 py-2 text-sm font-semibold">
          {draft.hook}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-text-secondary">
          <span>{draft.durationSeconds}초</span>
          <span>·</span>
          <span>{draft.targetAudience}</span>
          <span>·</span>
          <span>{draft.experimentId}</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <h3 className="text-xs font-bold text-text-secondary mb-2">전체 내레이션</h3>
          <p className="text-sm leading-7 whitespace-pre-line">{draft.narration}</p>
        </div>

        <div>
          <h3 className="text-xs font-bold text-text-secondary mb-2">장면 구성</h3>
          <div className="space-y-2">
            {draft.scenes.map(scene => (
              <div key={`${scene.order}-${scene.onScreenText}`} className="bg-[#0d1117] border border-border rounded-lg p-3">
                <div className="flex justify-between text-[10px] text-text-secondary">
                  <span>SCENE {scene.order}</span>
                  <span>{scene.seconds}초</span>
                </div>
                <div className="font-semibold text-sm mt-1">{scene.onScreenText}</div>
                <p className="text-xs mt-2 leading-relaxed">{scene.narration}</p>
                <p className="text-[11px] text-accent-blue mt-2">화면: {scene.visualDirection}</p>
              </div>
            ))}
          </div>
        </div>

        <InfoBlock title="사이트 CTA" items={[draft.siteCta]} />
        <InfoBlock title="게시 설명" items={[draft.caption, draft.hashtags.join(' ')]} />
        <InfoBlock title="사실 확인" items={draft.factChecks} warning />
        <InfoBlock title="출처" items={draft.sourceCredits} />
        <InfoBlock title="필수 고지" items={[draft.disclaimer, draft.aiDisclosure]} warning />
      </div>
    </div>
  );
}

function InfoBlock({ title, items, warning = false }: { title: string; items: string[]; warning?: boolean }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-text-secondary mb-2">{title}</h3>
      <ul className={`space-y-1.5 text-xs leading-relaxed ${warning ? 'text-[#d29922]' : 'text-text-primary'}`}>
        {items.filter(Boolean).map((item, index) => <li key={`${title}-${index}`}>• {item}</li>)}
      </ul>
    </div>
  );
}

