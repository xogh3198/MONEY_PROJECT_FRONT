'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DividendPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center py-20 text-text-secondary">로딩 중...</div>;

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

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">💰 배당 관리</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="연간 예상 배당" value="170,131원" />
        <StatCard label="보유 종목" value="3종목" />
        <StatCard label="ISA 비과세 잔여" value="1,829,869원" />
        <StatCard label="다음 배당락일" value="D-8" />
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">나의 포트폴리오</h2>
          <button className="px-3 py-1.5 bg-accent text-black text-sm rounded hover:opacity-90">+ 종목 추가</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-secondary border-b border-border">
              <th className="py-2 text-left">종목</th>
              <th className="py-2 text-right">수량</th>
              <th className="py-2 text-right">주당배당</th>
              <th className="py-2 text-right">예상배당</th>
              <th className="py-2 text-right">배당락일</th>
            </tr>
          </thead>
          <tbody>
            <PortfolioRow name="삼성전자" code="005930" qty={100} dividend={361} exDate="06/25" />
            <PortfolioRow name="SK하이닉스" code="000660" qty={50} dividend={1200} exDate="06/25" />
            <PortfolioRow name="SK텔레콤" code="017670" qty={30} dividend={3500} exDate="03/28" />
          </tbody>
        </table>
      </div>

      <p className="text-center text-xs text-text-secondary mt-8">
        ※ 본 정보는 투자 조언이 아닙니다. 투자 판단의 책임은 사용자에게 있습니다.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="text-xs text-text-secondary mb-1">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function PortfolioRow({ name, code, qty, dividend, exDate }: {
  name: string; code: string; qty: number; dividend: number; exDate: string;
}) {
  return (
    <tr className="border-b border-border/50 hover:bg-border/20">
      <td className="py-3"><span className="font-medium">{name}</span><span className="text-text-secondary ml-2 text-xs">{code}</span></td>
      <td className="py-3 text-right">{qty}주</td>
      <td className="py-3 text-right">{dividend.toLocaleString()}원</td>
      <td className="py-3 text-right text-accent">{(qty * dividend).toLocaleString()}원</td>
      <td className="py-3 text-right text-text-secondary">{exDate}</td>
    </tr>
  );
}
