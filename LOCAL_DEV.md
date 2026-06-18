# 로컬 개발 환경

## 프론트엔드 로컬 실행
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

API는 EC2 백엔드(15.164.171.43)를 자동으로 사용합니다 (API Route 프록시).

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
