import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'InvestBoard 금융 데이터 브리핑';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, color: '#f0f6fc', background: 'linear-gradient(135deg,#0d1117 0%,#161b22 58%,#17230f 100%)', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, color: '#a3e635', fontWeight: 700 }}>
        <div style={{ width: 18, height: 18, borderRadius: 99, background: '#a3e635' }} /> InvestBoard
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 68, lineHeight: 1.15, fontWeight: 800, maxWidth: 950 }}>오늘 내 돈에 영향을 주는 금융 데이터</div>
        <div style={{ fontSize: 30, color: '#8b949e' }}>뉴스 · 시장지표 · 공개 관심 신호 · 계산 도구</div>
      </div>
      <div style={{ fontSize: 24, color: '#8b949e' }}>investboard.cloud</div>
    </div>,
    size,
  );
}
