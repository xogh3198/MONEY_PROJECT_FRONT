import Link from 'next/link';

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <p className="text-xs font-semibold tracking-[0.16em] text-accent">DATA CONNECTION STATUS</p>
        <h1 className="mt-2 text-2xl font-bold">경제 캘린더 연동 준비 중</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          이전 화면의 고정 일정은 실제 API 데이터가 아니어서 제거했습니다. 공식 발표 일정과
          갱신 시각을 검증할 수 있는 연동이 준비된 뒤 다시 제공합니다.
        </p>
      </header>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#d29922]" aria-hidden="true" />
          <div>
            <h2 className="font-bold">현재 상태: API 미연동</h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              날짜가 지난 FOMC·금통위·배당락일을 최신 일정처럼 표시하지 않습니다.
              출처, 기준 시간대, 마지막 갱신 시각을 함께 제공할 수 있을 때 운영 기능으로 전환합니다.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link href="/briefing" className="rounded-xl border border-border bg-card p-5 transition hover:border-accent/50">
          <span className="text-xs text-accent">매일 갱신</span>
          <h2 className="mt-2 font-bold">오늘의 브리핑</h2>
          <p className="mt-2 text-xs leading-5 text-text-secondary">현재 수집된 뉴스와 시장 지표로 오늘의 핵심 이슈를 확인합니다.</p>
        </Link>
        <Link href="/market" className="rounded-xl border border-border bg-card p-5 transition hover:border-accent/50">
          <span className="text-xs text-accent-blue">API 연결됨</span>
          <h2 className="mt-2 font-bold">시장 지표</h2>
          <p className="mt-2 text-xs leading-5 text-text-secondary">최근 수집된 코스피·환율·미국시장·원자재 값을 확인합니다.</p>
        </Link>
      </div>
    </div>
  );
}
