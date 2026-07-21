# 로컬 개발 환경

## 프론트엔드 로컬 실행
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

API는 환경변수가 없을 때 EC2 백엔드(13.124.149.70)를 사용합니다 (API Route 프록시).

콘텐츠 스튜디오(`/content-studio`)는 아래 서버 전용 환경변수가 필요합니다.

```bash
CONTENT_STUDIO_ACCESS_KEY=(충분히 긴 임의 문자열)
GEMINI_API_KEY=(Google AI Studio 키)
GEMINI_MODEL=gemini-3.1-flash-lite
```

## 백엔드 로컬 실행 (선택)
```bash
cd backend
docker compose up -d postgres news-service
# → localhost:8083 (news-service)
# → localhost:8080 (dividend-engine)
```

## 개발 플로우
1. `dev` 브랜치에서 작업
2. dev에 push
3. GitHub에서 dev → main PR 생성
4. CI 통과 → 자동 Merge
5. main merge → EC2 자동 배포
