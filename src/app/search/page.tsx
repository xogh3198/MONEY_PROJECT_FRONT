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
  { code: '005930', name: '?¼ì„±?„ì', price: 87500, change: 1500, changePercent: 1.74, market: 'KOSPI' },
  { code: '000660', name: 'SK?˜ì´?‰ìŠ¤', price: 245000, change: -3000, changePercent: -1.21, market: 'KOSPI' },
  { code: '373220', name: 'LG?ë„ˆì§€?”ë£¨??, price: 380000, change: 5000, changePercent: 1.33, market: 'KOSPI' },
  { code: '005380', name: '?„ë?ì°?, price: 298000, change: 2500, changePercent: 0.85, market: 'KOSPI' },
  { code: '035720', name: 'ì¹´ì¹´??, price: 42500, change: -500, changePercent: -1.16, market: 'KOSPI' },
  { code: '051910', name: 'LG?”í•™', price: 310000, change: 8000, changePercent: 2.65, market: 'KOSPI' },
  { code: '006400', name: '?¼ì„±SDI', price: 415000, change: -2000, changePercent: -0.48, market: 'KOSPI' },
  { code: '035420', name: 'NAVER', price: 195000, change: 3000, changePercent: 1.56, market: 'KOSPI' },
  { code: '068270', name: '?€?¸ë¦¬??, price: 178000, change: 1000, changePercent: 0.56, market: 'KOSPI' },
  { code: '105560', name: 'KBê¸ˆìœµ', price: 95800, change: 800, changePercent: 0.84, market: 'KOSPI' },
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
        <h1 className="text-xl font-bold">?” ì¢…ëª© ê²€??/h1>
        <p className="text-xs text-text-secondary mt-1">ì¢…ëª©ëª??ëŠ” ì½”ë“œë¡?ê²€?‰í•˜?¸ìš”</p>
      </div>

      {/* ê²€?‰ì°½ */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="ì¢…ëª©ëª??ëŠ” ì¢…ëª©ì½”ë“œ ?…ë ¥ (?? ?¼ì„±?„ì, 005930)"
          className="w-full px-4 py-3 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
          autoFocus
        />
      </div>

      {/* ê²€??ê²°ê³¼ */}
      {query && results.length > 0 && (
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-2 border-b border-border text-xs text-text-secondary">
            ê²€??ê²°ê³¼ ({results.length}ê±?
          </div>
          {results.map(stock => (
            <StockRow key={stock.code} stock={stock} />
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-8 text-text-secondary text-sm">ê²€??ê²°ê³¼ê°€ ?†ìŠµ?ˆë‹¤</div>
      )}

      {/* ?¸ê¸° ì¢…ëª© */}
      {!query && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold">?“ˆ ?¸ê¸° ì¢…ëª©</h2>
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
        <div className="text-[13px] font-bold">{stock.price.toLocaleString()}??/div>
        <div className={`text-[11px] font-medium ${isUp ? 'text-[#f85149]' : 'text-[#58a6ff]'}`}>
          {isUp ? '?? : '??} {Math.abs(stock.change).toLocaleString()} ({isUp ? '+' : ''}{stock.changePercent}%)
        </div>
      </div>
    </div>
  );
}
