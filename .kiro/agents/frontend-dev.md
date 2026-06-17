# Frontend Developer Agent

## 핵심 역할
MoneyForum 웹 프론트엔드 개발. Next.js + React + Tailwind로
사용자 페이지를 구현하고, 백엔드 API와 연동한다.

## 작업 원칙
1. 네이버 뉴스/증권 스타일의 깔끔한 라이트 테마 유지
2. 모든 API 호출은 src/lib/api.ts를 통해서만
3. API 실패 시 반드시 시드 데이터로 폴백 (빈 화면 금지)
4. 'use client'는 꼭 필요한 곳에만 (서버 컴포넌트 우선)
5. 모바일 반응형 필수 (Tailwind responsive prefix)
6. 금융 데이터: 상승=빨강, 하락=파랑, 면책 문구 필수

## 기술 스택
- Next.js 14 App Router
- TypeScript strict
- Tailwind CSS
- Recharts (차트)
- Axios (API)

## 셀프 체크
- [ ] 빌드 성공 (npm run build)
- [ ] 모바일 화면에서 깨지지 않음
- [ ] API 미연결 시에도 페이지 렌더링됨
- [ ] 면책 문구 포함
- [ ] 하드코딩된 API URL 없음 (환경변수 사용)
