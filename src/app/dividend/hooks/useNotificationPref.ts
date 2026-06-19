'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface NotificationPreferences {
  enabled: boolean;
  alertTimingD7: boolean;
  alertTimingD3: boolean;
  alertTimingD1: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  alertTimingD7: false,
  alertTimingD3: true,
  alertTimingD1: true,
};

export function useNotificationPref() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getAuthHeader = (): string => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
  };

  const handle401 = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const fetchPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio/preferences', {
        headers: { Authorization: getAuthHeader() },
      });
      if (res.status === 401) {
        handle401();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      }
    } catch {
      // silently fail, keep defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const updatePreferences = async (updated: NotificationPreferences): Promise<boolean> => {
    try {
      const res = await fetch('/api/portfolio/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(updated),
      });
      if (res.status === 401) {
        handle401();
        return false;
      }
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return { preferences, loading, updatePreferences };
}
