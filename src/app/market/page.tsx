'use client';
import { useState, useEffect } from 'react';
import { fetchIndicators } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface Indicator { type: string; name: string; value: number; changePercent: number; prediction: string; updatedAt: string; }

const ORDER = ['KOSPI', 'KOSDAQ', 'USD_KRW', 'SP500', 'BTC', 'GOLD'];

export default function MarketPage() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selected, setSelected] = useState('KOSPI');
  const [history, setHistory] = useState<{date: string; value: number}[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 1분마다 갱신
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadHistory(selected);
  }, [selected]);

  const loadData = async () => {
    try {
      const data = await fetchIndicators();
      if (data?.length) {
        const sorted = [...data].sort((a: Indicator, b: Indicator) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type));
        setIndicators(sorted);
      }
    } catch {}
  };

  const loadHistory = async (type: string) => {
    try {
      const res = await fetch(`/api/market-history?type=${type}&days=30`);
      const data = await res.json();
      if (data?.length) setHistory(data);
    } catch {}
  };

  const selectedIndicator = indicators.find(i => i.type === selected);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">📊 시장 지표 & 예측</h1>
        <p className="text-xs text-text-secondary mt-1">실시간 시장 데이터 (1분 간격 갱신)</p>
      </div>

      {/* 지표 카드 */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {indicators.map(ind => {
          const isUp = ind.changePercent > 0;
          const isSelected = selected === ind.type;
          return (
            <button key={ind.type} onClick={() => setSelected(ind.type)}
              className={`p-3 rounded-lg border text-left transition ${
                isSelected ? 'bg-accent/10 border-accent' : 'bg-card border-border hover:border-text-secondary'
              }`}>
              <div className="text-[11px] text-text-secondary">{ind.name}</div>
              <div className="text-[15px] font-bold mt-0.5">
                {ind.type === 'BTC' || ind.type === 'GOLD' ? `$${Math.round(ind.value).toLocaleString()}` : ind.value.toLocaleString(undefined, {maximumFractionDigits: 2})}
              </div>
              <div className={`text-[12px] font-medium ${isUp ? 'text-[#f85149]' : ind.changePercent < 0 ? 'text-[#58a6ff]' : 'text-text-secondary'}`}>
                {isUp ? '▲' : ind.changePercent < 0 ? '▼' : '—'} {Math.abs(ind.changePercent).toFixed(2)}%
              </div>
            </button>
          );
        })}
      </div>

      {/* 차트 */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">{selectedIndicator?.name || ''} 추이 (30일)</h2>
          {selectedIndicator && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              selectedIndicator.prediction === 'UP' ? 'bg-[#f85149]/10 text-[#f85149]' :
              selectedIndicator.prediction === 'DOWN' ? 'bg-[#58a6ff]/10 text-[#58a6ff]' :
              'bg-border text-text-secondary'
            }`}>
              {selectedIndicator.prediction === 'UP' ? '📈 상승 예상' :
               selectedIndicator.prediction === 'DOWN' ? '📉 하락 예상' : '➡️ 보합'}
            </span>
          )}
        </div>
        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={history}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58a6ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#58a6ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
              <XAxis dataKey="date" fontSize={11} stroke="#8b949e" tickFormatter={d => d.substring(5)} />
              <YAxis fontSize={11} stroke="#8b949e" domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="value" stroke="#58a6ff" fill="url(#grad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-text-secondary text-sm">차트 데이터 로딩 중...</div>
        )}
      </div>

      {/* AI 예측 분석 */}
      <AIPrediction />

      {/* 마지막 갱신 시간 */}
      {selectedIndicator?.updatedAt && selectedIndicator.updatedAt !== 'loading' && (
        <div className="text-xs text-text-secondary text-center">
          마지막 갱신: {formatKST(selectedIndicator.updatedAt)}
        </div>
      )}

      <p className="text-center text-[11px] text-text-secondary mt-6">
        ※ AI 분석 결과이며 투자 조언이 아닙니다. 투자 판단의 책임은 사용자에게 있습니다.
      </p>
    </div>
  );
}

function AIPrediction() {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState('');

  useEffect(() => {
    loadPrediction();
  }, []);

  const loadPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-prediction');
      const data = await res.json();
      setAnalysis(data.analysis);
      setUpdatedAt(data.updatedAt);
    } catch {
      setAnalysis('AI 분석을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold flex items-center gap-2">
          <span className="text-lg">🤖</span> AI 시장 분석
        </h2>
        <button onClick={loadPrediction} className="text-xs text-accent-blue hover:underline">
          새로고침
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-text-secondary animate-pulse">AI가 시장을 분석하고 있습니다...</div>
      ) : (
        <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
          {analysis}
        </div>
      )}

      {updatedAt && (
        <div className="mt-3 text-[11px] text-text-secondary">
          분석 시각: {new Date(updatedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
        </div>
      )}

      <p className="mt-3 text-[10px] text-text-secondary border-t border-border pt-2">
        ※ AI 분석 결과이며 투자 조언이 아닙니다. 투자 판단의 책임은 사용자에게 있습니다.
      </p>
    </div>
  );
}

function formatKST(utcString: string): string {
  const utc = new Date(utcString);
  const kst = new Date(utc.getTime() + 9 * 60 * 60 * 1000);
  return kst.toLocaleString('ko-KR');
}
