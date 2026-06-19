'use client';
import { useState } from 'react';
import { AddStockPayload } from '../hooks/usePortfolio';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AddStockPayload) => Promise<boolean>;
}

export default function AddStockModal({ isOpen, onClose, onSubmit }: AddStockModalProps) {
  const [stockCode, setStockCode] = useState('');
  const [stockName, setStockName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [exDividendDate, setExDividendDate] = useState('');
  const [dividendPerShare, setDividendPerShare] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!stockCode.trim()) newErrors.stockCode = '종목코드를 입력하세요';
    if (!stockName.trim()) newErrors.stockName = '종목명을 입력하세요';
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
    const payload: AddStockPayload = {
      stockCode: stockCode.trim(),
      stockName: stockName.trim(),
      quantity: parseInt(quantity),
      exDividendDate: exDividendDate || null,
      dividendPerShare: parseFloat(dividendPerShare) || 0,
    };

    const success = await onSubmit(payload);
    setSubmitting(false);

    if (success) {
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setStockCode('');
    setStockName('');
    setQuantity('');
    setExDividendDate('');
    setDividendPerShare('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50">
      <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">종목 추가</h2>
          <button onClick={handleClose} className="text-text-secondary hover:text-text-primary text-xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-1">종목코드 *</label>
            <input
              type="text"
              value={stockCode}
              onChange={(e) => setStockCode(e.target.value)}
              className="w-full bg-card border border-border rounded-lg text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-accent"
              placeholder="예: 005930"
            />
            {errors.stockCode && <p className="text-negative text-xs mt-1">{errors.stockCode}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">종목명 *</label>
            <input
              type="text"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              className="w-full bg-card border border-border rounded-lg text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-accent"
              placeholder="예: 삼성전자"
            />
            {errors.stockName && <p className="text-negative text-xs mt-1">{errors.stockName}</p>}
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1">수량 *</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-card border border-border rounded-lg text-sm text-text-primary px-3 py-2 focus:outline-none focus:border-accent"
              placeholder="1"
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
              placeholder="0"
              min="0"
              step="0.01"
            />
            {errors.dividendPerShare && <p className="text-negative text-xs mt-1">{errors.dividendPerShare}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-accent text-black text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {submitting ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
