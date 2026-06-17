---
inclusion: always
---

## MoneyForum 프론트엔드

### 개요
경제 뉴스 포럼 + 시장 지표 + 배당 관리 웹 플랫폼의 프론트엔드.

### 기술 스택
- Next.js 14 (App Router, SSR)
- React 18 + TypeScript
- Tailwind CSS
- Recharts (차트)
- Axios (API 통신)

### 디자인 원칙
- 네이버 뉴스/증권 스타일 (라이트 테마, 깔끔한 카드형)
- 흰 배경(#fff) + 회색 보더(#e4e4e4) + 초록 포인트(#03c75a)
- 한국 주식 관례: 상승=빨강(#d63031), 하락=파랑(#0984e3)
- 모바일 반응형 필수
- 폰트: Pretendard

### 페이지 구성
| 경로 | 페이지 | 백엔드 API |
|------|--------|-----------|
| / | 메인 (지표+뉴스+사이드바) | news-service, market-indicator |
| /forum | 경제 포럼 (뉴스+투표+댓글) | news-service |
| /market | 시장 지표 (차트+예측) | market-indicator |
| /dividend | 배당 관리 (캘린더+포트폴리오) | dividend-engine |

### 백엔드 API 주소
- 프로덕션: http://43.200.177.146:8080 (dividend-engine), :8083 (news-service)
- 로컬: http://localhost:8080, http://localhost:8083
- 환경변수: NEXT_PUBLIC_ENGINE_API_URL, NEXT_PUBLIC_NEWS_API_URL

### 배포
- Vercel (GitHub push 시 자동 배포)
- 레포: xogh3198/MONEY_PROJECT_FRONT
