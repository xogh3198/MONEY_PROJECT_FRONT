'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface PortfolioItem {
  id: string;
  stockCode: string;
  stockName: string;
  quantity: number;
  exDividendDate: string | null;
  dividendPerShare: number;
  expectedDividend: number;
  createdAt: string;
}

export interface AddStockPayload {
  stockCode: string;
  stockName: string;
  quantity: number;
  exDividendDate: string | null;
  dividendPerShare: number;
}

export interface UpdateStockPayload {
  quantity: number;
  exDividendDate: string | null;
  dividendPerShare: number;
}

export function usePortfolio() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/portfolio', {
        headers: { Authorization: getAuthHeader() },
      });
      if (res.status === 401) {
        handle401();
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '포트폴리오 조회 실패');
      }
      const data = await res.json();
      setPortfolios(data);
    } catch (err: any) {
      setError(err.message || '서버 연결에 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const addStock = async (payload: AddStockPayload): Promise<boolean> => {
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        handle401();
        return false;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '종목 추가 실패');
      }
      await fetchPortfolios();
      return true;
    } catch (err: any) {
      setError(err.message || '종목 추가에 실패했습니다');
      return false;
    }
  };

  const updateStock = async (id: string, payload: UpdateStockPayload): Promise<boolean> => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthHeader(),
        },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        handle401();
        return false;
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '종목 수정 실패');
      }
      await fetchPortfolios();
      return true;
    } catch (err: any) {
      setError(err.message || '종목 수정에 실패했습니다');
      return false;
    }
  };

  const deleteStock = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: getAuthHeader() },
      });
      if (res.status === 401) {
        handle401();
        return false;
      }
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.error || '종목 삭제 실패');
      }
      await fetchPortfolios();
      return true;
    } catch (err: any) {
      setError(err.message || '종목 삭제에 실패했습니다');
      return false;
    }
  };

  return {
    portfolios,
    loading,
    error,
    addStock,
    updateStock,
    deleteStock,
    refresh: fetchPortfolios,
  };
}
