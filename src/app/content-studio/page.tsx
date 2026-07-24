'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  ContentOpportunity,
  ContentScriptDraft,
} from '@/lib/content-studio';

const STORAGE_KEY = 'investboard_content_studio_key';
const REVIEW_STORAGE_KEY = 'investboard_content_studio_reviews_v1';

type ReviewDecision = 'KEEP' | 'HOLD' | 'DROP' | 'APPROVE' | 'REVISE' | 'REJECT';

interface ReviewRecord {
  id: string;
  kind: 'opportunity' | 'draft';
  title: string;
  decision: ReviewDecision;
  reviewedAt: string;
}

interface OperationsStatus {
  generatedAt: string;
  integrations: {
    naverDataLabEnabled: boolean;
    naverCredentialsConfigured: boolean;
    externalMetricsEnabled: boolean;
    youtubeApiConfigured: boolean;
  };
  articles: {
    total: number;
    internalViewed: number;
    internalCommented: number;
    internalVoted: number;
    externalValuesAvailable: number;
    searchInterestAvailable: number;
    lastExternalMetricsUpdate?: string;
    lastSearchInterestUpdate?: string;
    externalStatusCounts: Record<string, number>;
  };
  collectors: Array<{
    name: string;
    status: string;
    enabled: boolean;
    configured: boolean;
    lastAttemptAt?: string;
    lastSuccessAt?: string;
    lastFailureAt?: string;
    processedCount?: number;
    availableCount?: number;
    message?: string;
  }>;
}

export default function ContentStudioPage() {
  const [accessKey, setAccessKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [opportunities, setOpportunities] = useState<ContentOpportunity[]>([]);
  const [selected, setSelected] = useState<ContentOpportunity | null>(null);
  const [draft, setDraft] = useState<ContentScriptDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [operationsStatus, setOperationsStatus] = useState<OperationsStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [reviews, setReviews] = useState<Record<string, ReviewRecord>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || '';
    const savedReviews = localStorage.getItem(REVIEW_STORAGE_KEY);
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch {
        localStorage.removeItem(REVIEW_STORAGE_KEY);
      }
    }
    if (saved) {
      setAccessKey(saved);
      setKeyInput(saved);
      void loadOpportunities(saved);
      void loadOperationsStatus(saved);
    }
  }, []);

  const authenticate = (event: FormEvent) => {
    event.preventDefault();
    const nextKey = keyInput.trim();
    if (!nextKey) return;
    localStorage.setItem(STORAGE_KEY, nextKey);
    setAccessKey(nextKey);
    void loadOpportunities(nextKey);
    void loadOperationsStatus(nextKey);
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

  const loadOperationsStatus = async (key = accessKey) => {
    setStatusLoading(true);
    try {
      const response = await fetch('/api/content-studio/status', {
        cache: 'no-store',
        headers: { 'x-content-studio-key': key },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '운영 상태를 불러오지 못했습니다.');
      setOperationsStatus(data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '운영 상태를 불러오지 못했습니다.');
    } finally {
      setStatusLoading(false);
    }
  };

  const saveReview = (
    id: string,
    kind: ReviewRecord['kind'],
    title: string,
    decision: ReviewDecision,
  ) => {
    setReviews(current => {
      const next = {
        ...current,
        [id]: { id, kind, title, decision, reviewedAt: new Date().toISOString() },
      };
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const copyReviewLog = async () => {
    const payload = {
      experimentId: 'E-001',
      exportedAt: new Date().toISOString(),
      reviews: Object.values(reviews).sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt)),
    };
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
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
        <>
          <OperationsPanel
            status={operationsStatus}
            loading={statusLoading}
            onRefresh={() => void loadOperationsStatus()}
          />

          <section className="bg-card border border-border rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="font-bold">E-001 검수 기록</h2>
                <p className="text-xs text-text-secondary mt-1">
                  후보 {Object.values(reviews).filter(item => item.kind === 'opportunity').length}건 ·
                  대본 {Object.values(reviews).filter(item => item.kind === 'draft').length}건 검수
                </p>
              </div>
              <button
                onClick={() => void copyReviewLog()}
                disabled={Object.keys(reviews).length === 0}
                className="border border-border rounded-lg px-3 py-2 text-xs disabled:opacity-40"
              >
                검수 기록 JSON 복사
              </button>
            </div>
            <p className="mt-3 text-[11px] leading-5 text-text-secondary">
              기록은 이 브라우저에만 저장됩니다. 10건 검수 후 JSON을 실험 기록에 첨부해 적합도·사실 오류·수정 시간을 계산합니다.
            </p>
          </section>

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

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
                  <span className="mr-1 text-[10px] text-text-secondary">후보 검수</span>
                  <ReviewButton
                    active={reviews[opportunity.id]?.decision === 'KEEP'}
                    onClick={() => saveReview(opportunity.id, 'opportunity', opportunity.title, 'KEEP')}
                  >
                    제작 가치 있음
                  </ReviewButton>
                  <ReviewButton
                    active={reviews[opportunity.id]?.decision === 'HOLD'}
                    onClick={() => saveReview(opportunity.id, 'opportunity', opportunity.title, 'HOLD')}
                  >
                    보류
                  </ReviewButton>
                  <ReviewButton
                    active={reviews[opportunity.id]?.decision === 'DROP'}
                    onClick={() => saveReview(opportunity.id, 'opportunity', opportunity.title, 'DROP')}
                  >
                    제외
                  </ReviewButton>
                </div>
              </article>
            ))}
          </section>

          <section className="xl:sticky xl:top-16 xl:self-start">
            <DraftPanel
              draft={draft}
              loading={draftLoading}
              selected={selected}
              review={draft ? reviews[draft.experimentId] : undefined}
              onReview={(decision) => {
                if (draft) saveReview(draft.experimentId, 'draft', draft.title, decision);
              }}
            />
          </section>
        </div>
        </>
      )}
    </div>
  );
}

function DraftPanel({
  draft,
  loading,
  selected,
  review,
  onReview,
}: {
  draft: ContentScriptDraft | null;
  loading: boolean;
  selected: ContentOpportunity | null;
  review?: ReviewRecord;
  onReview: (decision: ReviewDecision) => void;
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
        <div className="border-t border-border pt-4">
          <h3 className="text-xs font-bold text-text-secondary mb-2">대본 검수 결정</h3>
          <div className="flex flex-wrap gap-2">
            <ReviewButton active={review?.decision === 'APPROVE'} onClick={() => onReview('APPROVE')}>
              사용 가능
            </ReviewButton>
            <ReviewButton active={review?.decision === 'REVISE'} onClick={() => onReview('REVISE')}>
              수정 필요
            </ReviewButton>
            <ReviewButton active={review?.decision === 'REJECT'} onClick={() => onReview('REJECT')}>
              폐기
            </ReviewButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function OperationsPanel({
  status,
  loading,
  onRefresh,
}: {
  status: OperationsStatus | null;
  loading: boolean;
  onRefresh: () => void;
}) {
  const datalab = status?.collectors.find(item => item.name === 'NAVER_DATALAB');
  const external = status?.collectors.find(item => item.name === 'EXTERNAL_ENGAGEMENT');

  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">운영 데이터 진단</h2>
          <p className="text-xs text-text-secondary mt-1">키 값은 노출하지 않고 설정 여부·마지막 실행·실제 수집률만 표시합니다.</p>
        </div>
        <button onClick={onRefresh} disabled={loading} className="border border-border rounded-lg px-3 py-2 text-xs disabled:opacity-50">
          {loading ? '확인 중…' : '상태 새로고침'}
        </button>
      </div>

      {!status ? (
        <p className="mt-4 text-sm text-text-secondary">아직 운영 상태를 불러오지 못했습니다.</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <MetricCard label="전체 뉴스" value={status.articles.total} />
            <MetricCard label="DataLab 값 있음" value={status.articles.searchInterestAvailable} total={status.articles.total} />
            <MetricCard label="외부 실수치 있음" value={status.articles.externalValuesAvailable} total={status.articles.total} />
            <MetricCard label="내부 조회 발생" value={status.articles.internalViewed} total={status.articles.total} />
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <CollectorCard
              title="네이버 DataLab"
              configured={status.integrations.naverCredentialsConfigured}
              state={datalab}
              emptyMessage="첫 실행 전이거나 상태 저장 기능 배포 직후입니다."
            />
            <CollectorCard
              title="외부 반응 수집"
              configured={status.integrations.externalMetricsEnabled}
              state={external}
              emptyMessage="첫 실행 전이거나 상태 저장 기능 배포 직후입니다."
            />
          </div>

          <div className="mt-3 text-[11px] leading-5 text-text-secondary">
            외부 상태: {Object.entries(status.articles.externalStatusCounts)
              .map(([name, count]) => `${name} ${count}`)
              .join(' · ')}
          </div>
        </>
      )}
    </section>
  );
}

function MetricCard({ label, value, total }: { label: string; value: number; total?: number }) {
  const percent = total ? Math.round((value / total) * 1000) / 10 : null;
  return (
    <div className="rounded-lg border border-border bg-[#0d1117] p-3">
      <div className="text-[10px] text-text-secondary">{label}</div>
      <div className="mt-1 text-lg font-bold">
        {value.toLocaleString()}
        {percent !== null && <span className="ml-1 text-[10px] font-normal text-text-secondary">({percent}%)</span>}
      </div>
    </div>
  );
}

function CollectorCard({
  title,
  configured,
  state,
  emptyMessage,
}: {
  title: string;
  configured: boolean;
  state?: OperationsStatus['collectors'][number];
  emptyMessage: string;
}) {
  return (
    <div className="rounded-lg border border-border p-4 text-xs">
      <div className="flex items-center justify-between gap-2">
        <strong>{title}</strong>
        <span className={state?.status === 'SUCCESS' ? 'text-[#3fb950]' : state?.status === 'FAILED' ? 'text-[#f85149]' : 'text-[#d29922]'}>
          {state?.status || (configured ? 'WAITING' : 'NOT CONFIGURED')}
        </span>
      </div>
      <p className="mt-2 leading-5 text-text-secondary">{state?.message || emptyMessage}</p>
      {state?.lastAttemptAt && (
        <p className="mt-2 text-[10px] text-text-secondary">
          마지막 시도 {new Date(state.lastAttemptAt).toLocaleString('ko-KR')} · 처리 {state.processedCount || 0} · 확보 {state.availableCount || 0}
        </p>
      )}
    </div>
  );
}

function ReviewButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1.5 text-[11px] ${
        active ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
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
