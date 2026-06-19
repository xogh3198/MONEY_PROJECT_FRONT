'use client';
import { useState } from 'react';
import Link from 'next/link';

interface Stock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: string;
}

const POPULAR_STOCKS: Stock[] = [
  { code: '005930', name: '삼성전자', price: 87500, change: 1500, changePercent: 1.74, market: 'KOSPI' },
  { code: '000660', name: 'SK하이닉스', price: 245000, change: -3000, changePercent: -1.21, market: 'KOSPI' },
  { code: '373220', name: 'LG에너지솔루션', price: 380000, change: 5000, changePercent: 1.33, market: 'KOSPI' },
  { code: '005380', name: '현대차', price: 298000, change: 2500, changePercent: 0.85, market: 'KOSPI' },
  { code: '035720', name: '카카오', price: 42500, change: -500, changePercent: -1.16, market: 'KOSPI' },
  { code: '051910', name: 'LG화학', price: 310000, change: 8000, changePercent: 2.65, market: 'KOSPI' },
  { code: '006400', name: '삼성SDI', price: 415000, change: -2000, changePercent: -0.48, market: 'KOSPI' },
  { code: '035420', name: 'NAVER', price: 195000, change: 3000, changePercent: 1.56, market: 'KOSPI' },
  { code: '068270', name: '셀트리온', price: 178000, change: 1000, changePercent: 0.56, market: 'KOSPI' },
  { code: '105560', name: 'KB금융', price: 95800, change: 800, changePercent: 0.84, market: 'KOSPI' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    const filtered = POPULAR_STOCKS.filter(s =>
      s.name.includes(value) || s.code.includes(value)
    );
    setResults(filtered);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">🔍 종목 검색</h1>
        <p className="text-xs text-text-secondary mt-1">종목명 또는 코드로 검색하세요</p>
      </div>

      {/* 검색창 */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="종목명 또는 종목코드 입력 (예: 삼성전자, 005930)"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          autoFocus
        />
      </div>

      {/* 검색 결과 */}
      {query && results.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border text-xs text-text-secondary">
            검색 결과 ({results.length}건)
          </div>
          {results.map(stock => (
            <StockRow key={stock.code} stock={stock} />
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-8 text-text-secondary text-sm">검색 결과가 없습니다</div>
      )}

      {/* 인기 종목 */}
      {!query && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold">📈 인기 종목</h2>
          </div>
          {POPULAR_STOCKS.map(stock => (
            <StockRow key={stock.code} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}

function StockRow({ stock }: { stock: Stock }) {
  const isUp = stock.change >= 0;
  return (
    <div className="px-4 py-3 flex items-center justify-between hover:bg-[#1c2129] transition cursor-pointer border-b border-border/30 last:border-0">
      <div>
        <span className="text-[13px] font-medium text-text-primary">{stock.name}</span>
        <span className="text-[11px] text-text-secondary ml-2">{stock.code}</span>
        <span className="text-[10px] text-text-secondary ml-2 px-1.5 py-0.5 bg-border/50 rounded">{stock.market}</span>
      </div>
      <div className="text-right">
        <div className="text-[13px] font-bold">{stock.price.toLocaleString()}원</div>
        <div className={`text-[11px] font-medium ${isUp ? 'text-[#f85149]' : 'text-[#58a6ff]'}`}>
          {isUp ? '▲' : '▼'} {Math.abs(stock.change).toLocaleString()} ({isUp ? '+' : ''}{stock.changePercent}%)
        </div>
      </div>
    </div>
  );
}
