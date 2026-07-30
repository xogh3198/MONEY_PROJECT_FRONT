'use client';

import { useCallback, useEffect, useState } from 'react';

interface GrowthSummary {
  totalEvents: number;
  uniqueVisitors: number;
  qualifiedVisitors: number;
  events: Record<string, number>;
}

interface OperationsStatus {
  integrations: {
    naverDataLabEnabled: boolean;
    naverCredentialsConfigured: boolean;
    externalMetricsEnabled: boolean;
    youtubeApiConfigured: boolean;
  };
  articles: {
    total: number;
    searchInterestAvailable: number;
  };
}

export default function StudioOperationsPanel({ accessKey }: { accessKey: string }) {
  const [growth, setGrowth] = useState<GrowthSummary | null>(null);
  const [operations, setOperations] = useState<OperationsStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const headers = { 'x-content-studio-key': accessKey };
    try {
      const [statusResponse, growthResponse] = await Promise.all([
        fetch('/api/content-studio/status', { headers, cache: 'no-store' }),
        fetch('/api/analytics/summary?days=30', { headers, cache: 'no-store' }),
      ]);
      if (!statusResponse.ok) throw new Error('수집 상태를 불러오지 못했습니다.');
      setOperations(await statusResponse.json());
      setGrowth(growthResponse.ok ? await growthResponse.json() : null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '운영 상태를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [accessKey]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="studio-operations" aria-label="운영 상태">
      <div className="studio-operations-heading">
        <div>
          <p className="section-kicker">LIVE OPERATIONS</p>
          <h2>기능이 아니라 실제 사용과 수집을 확인합니다.</h2>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading}>
          {loading ? '확인 중…' : '새로고침'}
        </button>
      </div>

      {error && <p className="studio-error">{error}</p>}
      <div className="studio-metric-grid">
        <Metric label="30일 방문자" value={growth?.uniqueVisitors} unavailable="배포 후 수집" />
        <Metric label="유효 행동 사용자" value={growth?.qualifiedVisitors} unavailable="배포 후 수집" />
        <Metric label="홍보 계획 생성" value={growth?.events?.promotion_plan_created} unavailable="0" />
        <Metric label="영상 초안 생성" value={growth?.events?.promotion_video_draft_created} unavailable="0" />
        <Metric label="전체 수집 기사" value={operations?.articles?.total} unavailable="확인 중" />
        <Metric label="검색 관심 확보" value={operations?.articles?.searchInterestAvailable} unavailable="확인 중" />
      </div>

      {operations && (
        <div className="studio-integration-row">
          <Status label="DataLab" active={operations.integrations.naverDataLabEnabled && operations.integrations.naverCredentialsConfigured} />
          <Status label="외부 공개 반응" active={operations.integrations.externalMetricsEnabled} />
          <Status label="YouTube API" active={operations.integrations.youtubeApiConfigured} optional />
          <span>최근 30일 이벤트 {growth?.totalEvents?.toLocaleString('ko-KR') ?? 0}건</span>
        </div>
      )}
    </section>
  );
}

function Metric({ label, value, unavailable }: { label: string; value?: number; unavailable: string }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value === undefined ? unavailable : value.toLocaleString('ko-KR')}</strong>
    </div>
  );
}

function Status({ label, active, optional = false }: { label: string; active: boolean; optional?: boolean }) {
  return (
    <span className={active ? 'is-active' : ''}>
      <i /> {label} {active ? '정상' : optional ? '선택 미연결' : '점검 필요'}
    </span>
  );
}
