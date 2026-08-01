# Codex + Antigravity 병렬 작업 운영 규칙

검증일: 2026-08-02

## 1. 목표

한 MacBook에서 Codex와 Antigravity를 동시에 사용하되 토큰과 작업 시간을 분산하고, 같은 코드나
배포를 동시에 건드려 발생하는 충돌을 막는다. 두 에이전트는 서로의 채팅을 공유하지 않으므로
Notion과 GitHub만 공유 상태로 사용한다.

## 2. 상태의 기준

| 정보 | 기준 시스템 |
| --- | --- |
| 작업 목적·우선순위·담당자·진행 상태 | Notion 통합 작업 대시보드 |
| 실제 변경 코드·브랜치·커밋 | GitHub |
| 프런트 배포 | GitHub 커밋과 Vercel 배포 상태 |
| 백엔드 배포 | GitHub Actions 실행과 EC2 헬스체크 |
| 로컬 채팅·계획·미커밋 파일 | 공유 상태로 인정하지 않음 |

Notion 위치는 `이태호의 Notion → 기술 블로그 → 개인프로젝트 → 개인프로젝트 통합 작업
대시보드`다. 프로젝트는 `공통`, `InvestingBoard`, `마케팅맵`, 상태는 `시작 전`, `진행 중`,
`완료`를 사용한다.

## 3. 작업 시작 체크리스트

1. Git 원격이 정확히 `xogh3198/MONEY_PROJECT_FRONT` 또는 `xogh3198/MONEY_PROJECT`인지 확인한다.
2. `origin/main`을 fetch하고 최근 GitHub 커밋과 진행 중인 Actions를 확인한다.
3. Notion에서 같은 작업과 수정 경로가 이미 `진행 중`인지 확인한다.
4. 충돌이 없으면 작업을 `진행 중`으로 바꾸고 다음 내용을 기록한다.
   - 실행 주체: `Codex` 또는 `Antigravity`
   - 저장소와 브랜치
   - 수정 예정 경로
   - 시작 시각
   - 완료 조건과 검증 명령
5. 별도 Git worktree와 전용 브랜치에서 작업한다.

브랜치는 `agent/codex/<task-slug>` 또는 `agent/antigravity/<task-slug>` 형식으로 만든다. 두
에이전트가 같은 물리 폴더나 같은 브랜치에서 동시에 작업하면 안 된다.

## 4. 병렬 작업 배분

동시에 진행할 수 있는 예:

- Codex: 백엔드 영상 API와 테스트
- Antigravity: 프런트 영상 편집 화면과 문구

동시에 진행하면 안 되는 예:

- 둘 다 `PromotionVideoStudio.tsx` 수정
- 둘 다 같은 DB 마이그레이션 수정
- 한쪽이 배포 중인데 다른 쪽이 이전 `main` 기준으로 다시 배포

작업 범위가 겹치면 먼저 끝난 쪽이 커밋하고, 다른 쪽이 최신 `main`을 반영한 뒤 시작한다.

## 5. 인수인계 형식

```markdown
### 에이전트 인수인계
- 담당: Codex | Antigravity
- Notion 작업: <URL 또는 제목>
- 저장소/브랜치: <repo> / <branch>
- 기준 main: <commit>
- 현재 커밋: <commit 또는 없음>
- 수정 파일: <paths>
- 완료 내용: <summary>
- 검증: <commands and result>
- 미완료·위험: <remaining work>
- 다음 담당: <agent>
```

인수인계 전 미커밋 파일이 있으면 반드시 파일 목록과 이유를 적는다. 새 담당자가 확인하기 전에는
기존 담당자가 같은 경로를 계속 수정하지 않는다.

## 6. main 반영과 배포

두 에이전트 모두 검증된 변경을 `main`에 반영하고 기존 GitHub 기반 배포를 실행할 수 있다. 단,
한 작업에서 최종 전달 담당은 한 명뿐이다.

1. push 직전에 다시 `origin/main`을 fetch한다.
2. 새 커밋이 있으면 통합하고 관련 테스트를 다시 실행한다.
3. 변경 파일이 다른 진행 중 작업의 소유 경로와 겹치지 않는지 확인한다.
4. `main`에 push한다.
5. 프런트는 Vercel 상태, 백엔드는 GitHub Actions와 헬스를 확인한다.
6. Notion에 커밋, 테스트, 배포 근거와 검증일을 남기고 `완료`로 바꾼다.

백엔드 배포는 동시에 두 번 실행하지 않는다. 실행 중인 워크플로가 있으면 완료될 때까지 기다린다.

## 7. AWS 경계

- AWS CLI, AWS Console, EC2 SSH, SSM, Secrets Manager, 직접 AWS API 접근은 Codex만 수행한다.
- Antigravity는 기존 GitHub Actions 배포를 실행하거나 상태를 읽을 수 있다.
- Antigravity는 AWS 자격 증명을 읽거나 복사하거나 변경하지 않는다.
- 어느 에이전트도 사용자 승인 없이 GitHub Actions 시크릿, Vercel 환경 변수, OAuth 권한을 바꾸지
  않는다.

## 8. 토큰 효율 원칙

- 새 에이전트에게 전체 채팅을 복사하지 않고 Notion 작업, 기준 커밋, 수정 경로, 완료 조건만 준다.
- 기존 결정은 `PRODUCT_STRATEGY.md`, `CONTENT_ENGINE.md`, `EXPERIMENTS.md`,
  `VIDEO_AUTOMATION_ARCHITECTURE.md`에서 필요한 부분만 읽는다.
- 동일한 조사·빌드·테스트를 두 에이전트가 중복 실행하지 않는다.
- 분석 전용 작업과 구현 작업을 분리하고, 한 작업의 소유자는 중간에 자주 바꾸지 않는다.

## 9. Antigravity 첫 요청 템플릿

```text
먼저 .agents/rules/parallel-work.md와 관련 제품 문서를 읽어라.
Notion 통합 작업 대시보드와 GitHub 최신 상태를 확인하고, 다른 에이전트가 소유한 작업이나
겹치는 파일은 수정하지 마라.

이번 작업: <Notion 제목/URL>
담당: Antigravity
수정 허용 경로: <paths>
완료 조건: <tests>

별도 worktree와 agent/antigravity/<task-slug> 브랜치를 사용한다. AWS에 직접 접근하지 않는다.
완료 후 커밋, 변경 파일, 테스트, 배포 상태를 Notion과 GitHub에 기록한다.
```
