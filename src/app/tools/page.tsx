'use client';
import { useState, useEffect } from 'react';
import { fetchIndicators } from '@/lib/api';

export default function ToolsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">?õ† ?¨Ïûê ?ÑÍµ¨</h1>
        <p className="text-xs text-text-secondary mt-1">?¨Ïûê???†Ïö©??Í≥ÑÏÇ∞Í∏∞Ï? ?ÑÍµ¨</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CurrencyCalculator />
        <DividendTaxCalculator />
      </div>
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
      <h2 className="font-bold mb-4 flex items-center gap-2">?í± ?òÏú® Í≥ÑÏÇ∞Í∏?/h2>
      <p className="text-xs text-text-secondary mb-4">?ÑÏû¨ ?òÏú®: $1 = ??usdKrw.toLocaleString()} (?§ÏãúÍ∞?</p>

      <div className="space-y-3">
        <div className="flex gap-2">
          <button onClick={() => setDirection('usd-to-krw')}
            className={`flex-1 py-2 rounded text-sm font-medium transition ${direction === 'usd-to-krw' ? 'bg-accent text-black' : 'bg-border/50 text-text-secondary'}`}>
            USD ??KRW
          </button>
          <button onClick={() => setDirection('krw-to-usd')}
            className={`flex-1 py-2 rounded text-sm font-medium transition ${direction === 'krw-to-usd' ? 'bg-accent text-black' : 'bg-border/50 text-text-secondary'}`}>
            KRW ??USD
          </button>
        </div>

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder={direction === 'usd-to-krw' ? '?¨Îü¨ Í∏àÏï°' : '?êÌôî Í∏àÏï°'}
          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
        />

        <div className="bg-bg border border-border rounded-lg p-4 text-center">
          <div className="text-xs text-text-secondary mb-1">?òÏÇ∞ Í≤∞Í≥º</div>
          <div className="text-2xl font-bold text-accent">
            {direction === 'usd-to-krw' ? `??{result}` : `$${result}`}
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
      taxName = '?êÏ≤úÏßïÏàò 15.4%';
      break;
    case 'isa':
      taxRate = amount > 2000000 ? 0.099 : 0;
      taxName = amount > 2000000 ? 'Ï¥àÍ≥ºÎ∂?9.9%' : 'ÎπÑÍ≥º??(200Îß??¥ÎÇ¥)';
      break;
    case 'irp':
      taxRate = 0;
      taxName = 'Í≥ºÏÑ∏?¥Ïó∞ (0%)';
      break;
  }

  const tax = Math.floor(amount * taxRate);
  const afterTax = amount - tax;

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <h2 className="font-bold mb-4 flex items-center gap-2">?í∞ Î∞∞Îãπ?∏Í∏à Í≥ÑÏÇ∞Í∏?/h2>
      <p className="text-xs text-text-secondary mb-4">Í≥ÑÏ¢å ?†ÌòïÎ≥??∏ÌõÑ Î∞∞ÎãπÍ∏?Í≥ÑÏÇ∞</p>

      <div className="space-y-3">
        <div className="flex gap-1">
          {[
            { value: 'general', label: '?ºÎ∞ò' },
            { value: 'isa', label: 'ISA' },
            { value: 'irp', label: 'IRP' },
          ].map(opt => (
            <button key={opt.value} onClick={() => setAccountType(opt.value as any)}
              className={`flex-1 py-2 rounded text-xs font-medium transition ${accountType === opt.value ? 'bg-accent text-black' : 'bg-border/50 text-text-secondary'}`}>
              {opt.label}
            </button>
          ))}
        </div>

        <input
          type="number"
          value={preTax}
          onChange={e => setPreTax(e.target.value)}
          placeholder="?∏Ï†Ñ Î∞∞ÎãπÍ∏?(??"
          className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm focus:outline-none focus:border-accent"
        />

        <div className="bg-bg border border-border rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">?∏Ï†Ñ Î∞∞ÎãπÍ∏?/span>
            <span>{amount.toLocaleString()}??/span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">?∏Í∏à ({taxName})</span>
            <span className="text-[#f85149]">-{tax.toLocaleString()}??/span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
            <span>?∏ÌõÑ ?òÎ†π??/span>
            <span className="text-accent">{afterTax.toLocaleString()}??/span>
          </div>
        </div>
      </div>
    </div>
  );
}
