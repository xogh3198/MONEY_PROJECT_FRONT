'use client';

const VISITOR_KEY = 'investboard_visitor_id_v1';
const SESSION_KEY = 'investboard_session_id_v1';
const ATTRIBUTION_KEY = 'investboard_attribution_v1';

type GrowthProperty = string | number | boolean;

interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
}

export function trackGrowthEvent(
  eventName: string,
  properties: Record<string, GrowthProperty> = {},
): void {
  if (typeof window === 'undefined') return;

  const attribution = readAttribution();
  const payload = {
    eventName,
    visitorId: persistentId(localStorage, VISITOR_KEY),
    sessionId: persistentId(sessionStorage, SESSION_KEY),
    path: window.location.pathname,
    ...attribution,
    properties,
  };

  void fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // 계측 실패가 사용자 행동을 막지 않도록 무시합니다.
  });
}

function readAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {
    utmSource: clean(params.get('utm_source')),
    utmMedium: clean(params.get('utm_medium')),
    utmCampaign: clean(params.get('utm_campaign')),
    utmContent: clean(params.get('utm_content')),
  };
  const hasCurrent = Object.values(current).some(Boolean);

  if (hasCurrent) {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(current));
    return current;
  }

  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || '{}') as Attribution;
  } catch {
    sessionStorage.removeItem(ATTRIBUTION_KEY);
    return {};
  }
}

function persistentId(storage: Storage, key: string): string {
  const saved = storage.getItem(key);
  if (saved && saved.length >= 16 && saved.length <= 80) return saved;
  const created = crypto.randomUUID();
  storage.setItem(key, created);
  return created;
}

function clean(value: string | null): string | undefined {
  const normalized = value?.trim().slice(0, 120);
  return normalized || undefined;
}
