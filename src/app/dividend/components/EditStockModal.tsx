'use client';
import { useState, useEffect } from 'react';
import { PortfolioItem, UpdateStockPayload } from '../hooks/usePortfolio';

interface EditStockModalProps {
  isOpen: boolean;
  stock: PortfolioItem | null;
  onClose: () => void;
  onSubmit: (id: string, payload: UpdateStockPayload) => Promise<boolean>;
}

export default function EditStockModal({ isOpen, stock, onClose, onSubmit }: EditStockModalProps) {
  const [quantity, setQuantity] = useState('');
  const [exDividendDate, setExDividendDate] = useState('');
  const [dividendPerShare, setDividendPerShare] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (stock) {
      setQuantity(String(stock.quantity));
      setExDividendDate(stock.exDividendDate || '');
      setDividendPerShare(String(stock.dividendPerShare));
      setErrors({});
    }
  }, [stock]);

  if (!isOpen || !stock) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!quantity || parseInt(quantity) < 1) newErrors.quantity = '수량은 1 이상이어야 합니다';
    if (dividendPerShare && parseFloat(dividendPerShare) < 0) {
      newErrors.dividendPerShare = '주당배당금은 0 이상이어야 합니다';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload: UpdateStockPayload = {
      quantity: parseInt(quantity),
      exDividendDate: exDividendDate || null,
      dividendPerShare: parseFloat(dividendPerShare) || 0,
    };

    const success = await onSubmit(stock.id, payload);
    setSubmitting(false);

    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">종목 수정</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">종목코드</label>
            <input
              type="text"
              value={stock.stockCode}
              disabled
              className="w-full bg-card border border-border rounded-lg text-sm text-text-secondary px-3 py-2 opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">종목명</label>
            <input
              type="text"
              value={stock.stockName}
              disabled
              className="w-full bg-card border border-border rounded-lg text-sm text-text-secondary px-3 py-2 opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">수량 *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-card border border-border rounded-lg text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-accent"
              min="1"
            />
            {errors.quantity && <p className="text-negative text-xs mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">배당락일</label>
            <input
              type="date"
              value={exDividendDate}
              onChange={(e) => setExDividendDate(e.target.value)}
              className="w-full bg-card border border-border rounded-lg text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">주당배당금 (원)</label>
            <input
              type="number"
              value={dividendPerShare}
              onChange={(e) => setDividendPerShare(e.target.value)}
              className="w-full bg-card border border-border rounded-lg text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-accent"
              min="0"
              step="0.01"
            />
            {errors.dividendPerShare && <p className="text-negative text-xs mt-1">{errors.dividendPerShare}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-accent text-black text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? '수정 중...' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
