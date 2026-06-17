---
inclusion: fileMatch
fileMatchPattern: "**/*.tsx,**/*.ts"
---

## React/Next.js 패턴

### 파일 구조
```
src/
├── app/              # Next.js App Router 페이지
│   ├── page.tsx      # 서버 컴포넌트 (기본)
│   ├── layout.tsx    # 레이아웃
│   └── {route}/page.tsx
├── components/       # 재사용 컴포넌트
└── lib/              # 유틸, API 클라이언트
```

### 규칙
1. 'use client'는 인터랙션이 필요한 컴포넌트에만 선언
2. API 호출은 src/lib/api.ts에 집중 (컴포넌트에서 직접 axios 호출 금지)
3. 스타일: Tailwind 유틸리티 클래스 사용 (인라인 style 최소화)
4. 컬러 값은 tailwind.config.ts에 정의된 것만 사용
5. 컴포넌트는 한 파일에 1개 export default + 필요시 내부 helper 함수
6. 큰 페이지는 섹션별 컴포넌트로 분리 (MarketTicker, NewsList 등)

### API 호출 패턴
```tsx
// ✅ lib/api.ts의 함수 사용
import { fetchNewsByCategory } from '@/lib/api';
const data = await fetchNewsByCategory('DOMESTIC');

// ❌ 컴포넌트에서 직접 호출 금지
const res = await axios.get('http://...');
```

### 에러 처리
- API 실패 시 시드 데이터로 폴백 (빈 화면 방지)
- try/catch로 감싸고, catch에서는 console.warn만 (사용자에게 에러 노출 최소화)

### 금융 데이터 표시 규칙
- 금액: toLocaleString() 사용 (천 단위 콤마)
- 상승: text-[#d63031] + ▲
- 하락: text-[#0984e3] + ▼
- 면책 문구: 모든 페이지 하단에 필수 포함
