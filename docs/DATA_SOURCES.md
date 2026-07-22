# 외부 관심 신호 데이터 소스 정책

마지막 검증일: 2026-07-22

## 수집 우선순위

1. 플랫폼의 공식 공개 API
2. robots가 허용한 공개 페이지의 Schema.org 구조화 데이터
3. InvestBoard 내부의 실제 조회·댓글·투표
4. 위 조건을 충족하지 못하면 수집하지 않고 상태만 표시

## 네이버

- [뉴스 검색 API](https://developers.naver.com/docs/serviceapi/search/news/news.md)
  - 제공: 제목, 원문 URL, 네이버 URL, 요약, 발행시각
  - 미제공: 기사 조회수, 댓글 수, 추천·비추천 수
  - 일 호출 한도: 25,000회
- [DataLab 통합 검색어 트렌드 API](https://developers.naver.com/docs/serviceapi/datalab/search/search.md)
  - 제공: 검색 추이의 0~100 상대 비율. 현재 구현은 기사 제목별 값이 아니라 카테고리 키워드 그룹의 분야 관심도다.
  - 일 호출 한도: 1,000회
  - 주의: 실제 검색 횟수나 기사 조회수가 아니다.
- robots 확인:
  - `https://news.naver.com/robots.txt`
  - `https://n.news.naver.com/robots.txt`
  - `https://apis.naver.com/robots.txt`
  - 2026-07-22 확인 결과 일반 사용자 에이전트에 `Disallow: /`

따라서 네이버 뉴스 화면이나 비공식 댓글·추천 내부 API를 서버에서 자동 호출하지 않는다. 기존 랭킹 페이지 크롤러는 기본 비활성화한다.

## 공개 구조화 데이터

- [Schema.org interactionStatistic](https://schema.org/interactionStatistic)
- [Schema.org InteractionCounter](https://schema.org/InteractionCounter)

원문이 `ViewAction`, `CommentAction`, `LikeAction`, `DislikeAction`과 `userInteractionCount`를 공개한 경우에만 집계 수치를 저장한다. 중복 JSON-LD 블록은 합산하지 않고 유형별 최댓값을 사용한다.

## YouTube

- [YouTube Data API videos.list](https://developers.google.com/youtube/v3/docs/videos/list)
- [YouTube video statistics](https://developers.google.com/youtube/v3/docs/videos)

공개 영상은 API 키가 있을 때 조회수·좋아요·댓글 수를 가져올 수 있다. 싫어요 수는 영상 소유자가 인증한 요청 외에는 비공개이므로 표시하지 않는다.

## 표시 원칙

- `InvestBoard 내부 반응`: InvestBoard에서 발생한 조회·댓글·투표
- `원문 공개 반응`: 공식 API 또는 공개 Schema.org가 제공한 수치
- `네이버 분야 검색 관심도`: DataLab 카테고리 키워드 그룹의 상대 비율
- 서로 다른 모집단의 수치를 합산한 가짜 총조회수는 만들지 않는다.
