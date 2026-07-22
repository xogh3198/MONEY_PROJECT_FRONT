'use client';
import { useState, useEffect } from 'react';
import { fetchIndicators } from '@/lib/api';
import Link from 'next/link';
import { track } from '@vercel/analytics/react';
import GrowthTracker from '@/components/analytics/GrowthTracker';

export default function ToolsPage() {
  return (
    <div>
      <GrowthTracker contentType="tools" contentId="tools" />
      <div className="mb-6">
        <h1 className="text-xl font-bold">🛠 투자 도구</h1>
        <p className="text-xs text-text-secondary mt-1">투자에 유용한 계산기와 도구</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrencyCalculator />
        <DividendTaxCalculator />
      </div>
      <section className="mt-6 rounded-lg border border-border bg-card p-5">
        <h2 className="font-bold">계산 결과를 이해하는 가이드</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <Link href="/guides/exchange-rate-overseas-stock-return" className="rounded-lg border border-border p-3 text-sm hover:border-accent/50">환율과 해외주식 수익률 →</Link>
          <Link href="/guides/rate-change-loan-interest" className="rounded-lg border border-border p-3 text-sm hover:border-accent/50">금리와 대출이자 →</Link>
          <Link href="/guides/dividend-yield-checklist" className="rounded-lg border border-border p-3 text-sm hover:border-accent/50">배당수익률 체크리스트 →</Link>
        </div>
      </section>
    </div>
  );
}

function CurrencyCalculator() {
  const [usdKrw, setUsdKrw] = useState(1527);
  const [amount, setAmount] = useState('1000');
  const [direction, setDirection] = useState<'usd-to-krw' | 'krw-to-usd'>('usd-to-krw');

  useEffect(() => {
    fetchIndicators().then(data => {
      const fx = data?.find((d: any) => d.type === 'USD_KRW');
      if (fx) setUsdKrw(fx.value);
    }).catch(() => {});
  }, []);

  const result = direction === 'usd-to-krw'
    ? (parseFloat(amount || '0') * usdKrw).toLocaleString('ko-KR', { maximumFractionDigits: 0 })
    : (parseFloat(amount || '0') / usdKrw).toLocaleString('en-US', { maximumFractionDigits: 2 });

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h2 className="font-bold mb-4 flex items-center gap-2">💱 환율 계산기</h2>
      <p className="text-xs text-text-secondary mb-4">현재 환율: $1 = ₩{usdKrw.toLocaleString()} (실시간)</p>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button onClick={() => setDirection('usd-to-krw')}
            className={`flex-1 py-2 rounded text-sm font-medium transition ${direction === 'usd-to-krw' ? 'bg-accent text-black' : 'bg-border/50 text-text-secondary'}`}>
            USD → KRW
          </button>
          <button onClick={() => setDirection('krw-to-usd')}
            className={`flex-1 py-2 rounded text-sm font-medium transition ${direction === 'krw-to-usd' ? 'bg-accent text-black' : 'bg-border/50 text-text-secondary'}`}>
            KRW → USD
          </button>
        </div>

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          onBlur={() => track('tool_complete', { tool: 'currency' })}
          placeholder={direction === 'usd-to-krw' ? '달러 금액' : '원화 금액'}
          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
        />

        <div className="bg-bg border border-border rounded-lg p-4 text-center">
          <div className="text-xs text-text-secondary mb-1">환산 결과</div>
          <div className="text-2xl font-bold text-accent">
            {direction === 'usd-to-krw' ? `₩${result}` : `$${result}`}
          </div>
        </div>
      </div>
    </div>
  );
}

function DividendTaxCalculator() {
  const [preTax, setPreTax] = useState('100000');
  const [accountType, setAccountType] = useState<'general' | 'isa' | 'irp'>('general');

  const amount = parseFloat(preTax || '0');
  let taxRate = 0;
  let taxName = '';

  switch (accountType) {
    case 'general':
      taxRate = 0.154;
      taxName = '원천징수 15.4%';
      break;
    case 'isa':
      taxRate = amount > 2000000 ? 0.099 : 0;
      taxName = amount > 2000000 ? '초과분 9.9%' : '비과세 (200만 이내)';
      break;
    case 'irp':
      taxRate = 0;
      taxName = '과세이연 (0%)';
      break;
  }

  const tax = Math.floor(amount * taxRate);
  const afterTax = amount - tax;

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h2 className="font-bold mb-4 flex items-center gap-2">💰 배당세금 계산기</h2>
      <p className="text-xs text-text-secondary mb-4">계좌 유형별 세후 배당금 계산</p>

      <div className="space-y-3">
        <div className="flex gap-1">
          {[
            { value: 'general', label: '일반' },
            { value: 'isa', label: 'ISA' },
            { value: 'irp', label: 'IRP' },
          ].map(opt => (
            <button key={opt.value} onClick={() => {
              setAccountType(opt.value as 'general' | 'isa' | 'irp');
              track('tool_option', { tool: 'dividend_tax', account_type: opt.value });
            }}
              className={`flex-1 py-2 rounded text-xs font-medium transition ${accountType === opt.value ? 'bg-accent text-black' : 'bg-border/50 text-text-secondary'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        <input
          type="number"
          value={preTax}
          onChange={e => setPreTax(e.target.value)}
          onBlur={() => track('tool_complete', { tool: 'dividend_tax' })}
          placeholder="세전 배당금 (원)"
          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
        />

        <div className="bg-bg border border-border rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">세전 배당금</span>
            <span>{amount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">세금 ({taxName})</span>
            <span className="text-[#f85149]">-{tax.toLocaleString()}원</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
            <span>세후 수령액</span>
            <span className="text-accent">{afterTax.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  );
}
