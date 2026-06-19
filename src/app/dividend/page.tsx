'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePortfolio, PortfolioItem } from './hooks/usePortfolio';
import AddStockModal from './components/AddStockModal';
import EditStockModal from './components/EditStockModal';
import NotificationSettings from './components/NotificationSettings';

export default function DividendPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStock, setEditingStock] = useState<PortfolioItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setAuthChecking(false);
  }, []);

  if (authChecking) {
    return <div className="text-center py-20 text-text-secondary">로딩 중...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold mb-2">로그인이 필요합니다</h2>
        <p className="text-text-secondary mb-6">배당 관리 기능은 로그인 후 이용할 수 있습니다</p>
        <Link href="/login" className="px-6 py-3 bg-accent text-black font-medium rounded-lg hover:opacity-90">
          로그인하기
        </Link>
      </div>
    );
  }

  return <DividendContent
    showAddModal={showAddModal}
    setShowAddModal={setShowAddModal}
    editingStock={editingStock}
    setEditingStock={setEditingStock}
    deleteConfirmId={deleteConfirmId}
    setDeleteConfirmId={setDeleteConfirmId}
  />;
}

function DividendContent({
  showAddModal,
  setShowAddModal,
  editingStock,
  setEditingStock,
  deleteConfirmId,
  setDeleteConfirmId,
}: {
  showAddModal: boolean;
  setShowAddModal: (v: boolean) => void;
  editingStock: PortfolioItem | null;
  setEditingStock: (v: PortfolioItem | null) => void;
  deleteConfirmId: string | null;
  setDeleteConfirmId: (v: string | null) => void;
}) {
  const { portfolios, loading, error, addStock, updateStock, deleteStock } = usePortfolio();

  const totalExpectedDividend = portfolios.reduce(
    (sum, item) => sum + (item.expectedDividend || 0),
    0
  );

  const totalStocks = portfolios.length;

  const nearestDN = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let minDays = Infinity;
    for (const item of portfolios) {
      if (!item.exDividendDate) continue;
      const exDate = new Date(item.exDividendDate);
      exDate.setHours(0, 0, 0, 0);
      const diff = Math.ceil((exDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diff > 0 && diff < minDays) {
        minDays = diff;
      }
    }
    return minDays === Infinity ? null : minDays;
  })();

  const handleDelete = async (id: string) => {
    await deleteStock(id);
    setDeleteConfirmId(null);
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-6">💰 배당 관리</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
              <div className="h-3 bg-border rounded w-20 mb-2" />
              <div className="h-6 bg-border rounded w-28" />
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-5 bg-border rounded w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-border rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">💰 배당 관리</h1>

      {error && (
        <div className="bg-negative/10 border border-negative/30 text-negative rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="연간 예상 배당" value={`${totalExpectedDividend.toLocaleString()}원`} />
        <StatCard label="보유 종목" value={`${totalStocks}종목`} />
        <StatCard label="다음 배당락일" value={nearestDN !== null ? `D-${nearestDN}` : '-'} />
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-text-primary">나의 포트폴리오</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-accent text-black text-sm font-medium rounded hover:opacity-90"
          >
            + 종목 추가
          </button>
        </div>

        {portfolios.length === 0 ? (
          <p className="text-center text-text-secondary py-8">
            등록된 종목이 없습니다. 종목을 추가해보세요.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary border-b border-border">
                  <th className="py-2 text-left">종목</th>
                  <th className="py-2 text-right">수량</th>
                  <th className="py-2 text-right">주당배당</th>
                  <th className="py-2 text-right">예상배당</th>
                  <th className="py-2 text-right">배당락일</th>
                  <th className="py-2 text-right">관리</th>
                </tr>
              </thead>
              <tbody>
                {portfolios.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-border/20">
                    <td className="py-3">
                      <span className="font-medium text-text-primary">{item.stockName}</span>
                      <span className="text-text-secondary ml-2 text-xs">{item.stockCode}</span>
                    </td>
                    <td className="py-3 text-right text-text-primary">{item.quantity}주</td>
                    <td className="py-3 text-right text-text-primary">
                      {Number(item.dividendPerShare).toLocaleString()}원
                    </td>
                    <td className="py-3 text-right text-accent">
                      {Number(item.expectedDividend).toLocaleString()}원
                    </td>
                    <td className="py-3 text-right text-text-secondary">
                      {item.exDividendDate
                        ? new Date(item.exDividendDate).toLocaleDateString('ko-KR', {
                            month: '2-digit',
                            day: '2-digit',
                          })
                        : '-'}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setEditingStock(item)}
                        className="text-text-secondary hover:text-accent text-xs mr-2"
                      >
                        수정
                      </button>
                      {deleteConfirmId === item.id ? (
                        <span className="text-xs">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-negative mr-1"
                          >
                            확인
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-text-secondary"
                          >
                            취소
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="text-text-secondary hover:text-negative text-xs"
                        >
                          삭제
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <NotificationSettings />

      <p className="text-center text-xs text-text-secondary mt-8">
        ※ 본 정보는 투자 조언이 아닙니다. 투자 판단의 책임은 사용자에게 있습니다.
      </p>

      <AddStockModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={addStock}
      />

      <EditStockModal
        isOpen={!!editingStock}
        stock={editingStock}
        onClose={() => setEditingStock(null)}
        onSubmit={updateStock}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-xs text-text-secondary mb-1">{label}</div>
      <div className="text-lg font-bold text-text-primary">{value}</div>
    </div>
  );
}
