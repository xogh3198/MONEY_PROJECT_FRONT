'use client';
import { useRef, useCallback } from 'react';
import { useNotificationPref, NotificationPreferences } from '../hooks/useNotificationPref';

export default function NotificationSettings() {
  const { preferences, loading, updatePreferences } = useNotificationPref();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (updated: NotificationPreferences) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updatePreferences(updated);
      }, 500);
    },
    [updatePreferences]
  );

  const toggleEnabled = () => {
    const updated = { ...preferences, enabled: !preferences.enabled };
    handleChange(updated);
  };

  const toggleTiming = (key: 'alertTimingD7' | 'alertTimingD3' | 'alertTimingD1') => {
    const updated = { ...preferences, [key]: !preferences[key] };
    handleChange(updated);
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
        <div className="h-5 bg-border rounded w-32 mb-4" />
        <div className="h-4 bg-border rounded w-48" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="font-bold text-text-primary mb-4">🔔 알림 설정</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary">알림 활성화</span>
          <button
            onClick={toggleEnabled}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              preferences.enabled ? 'bg-accent' : 'bg-border'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                preferences.enabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {preferences.enabled && (
          <div className="border-t border-border pt-4 space-y-3">
            <p className="text-xs text-text-secondary mb-2">배당락일 알림 타이밍</p>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.alertTimingD7}
                onChange={() => toggleTiming('alertTimingD7')}
                className="w-4 h-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-text-primary">D-7 (7일 전)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.alertTimingD3}
                onChange={() => toggleTiming('alertTimingD3')}
                className="w-4 h-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-text-primary">D-3 (3일 전)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.alertTimingD1}
                onChange={() => toggleTiming('alertTimingD1')}
                className="w-4 h-4 rounded border-border accent-accent"
              />
              <span className="text-sm text-text-primary">D-1 (1일 전)</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
