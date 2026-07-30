import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보 처리 안내',
  description: 'InvestBoard 베타 서비스가 처리하는 정보와 분석 데이터의 이용 목적을 안내합니다.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-accent">PRIVACY</p>
        <h1 className="mt-2 text-3xl font-bold">개인정보 처리 안내</h1>
        <p className="mt-3 text-sm text-text-secondary">시행·마지막 검토: 2026년 7월 30일</p>
      </header>

      <Section title="처리하는 정보">
        로그인 기능을 사용할 때 로그인 제공자가 전달한 식별자, 닉네임·이메일 등 계정 정보가 처리될 수
        있습니다. 게시글·댓글·투표처럼 사용자가 직접 남긴 내용과 서비스 이용 기록도 저장됩니다.
      </Section>
      <Section title="운영 분석 정보">
        페이지 경로, UTM 캠페인, 기능 완료 같은 최소 행동 이벤트와 브라우저에 생성한 임의 식별자를
        사용합니다. 임의 식별자는 서버에서 SHA-256으로 변환해 저장하며 애플리케이션은 분석 이벤트에
        IP 주소, 이메일, 로그인 토큰, 입력한 홍보 원문을 넣지 않습니다.
      </Section>
      <Section title="브라우저 저장소">
        로그인 토큰, 콘텐츠 스튜디오 접근 상태, 관심 주제는 쿠키 대신 브라우저의 localStorage 또는
        sessionStorage에 저장될 수 있습니다. 브라우저 데이터 삭제 기능으로 직접 제거할 수 있습니다.
        저장한 관심 주제의 구체적인 목록은 운영 분석 서버로 보내지 않습니다.
      </Section>
      <Section title="외부 처리 서비스">
        호스팅과 페이지 분석에 Vercel을 사용합니다. Vercel Web Analytics는 공식 문서상 쿠키 없이
        익명화·집계된 방식으로 페이지 방문을 처리합니다. 로그인 시 선택한 네이버·카카오의 정책도
        함께 적용됩니다.
      </Section>
      <Section title="보유와 삭제">
        자체 운영 분석 이벤트는 서비스 개선 검토를 위해 최대 180일 보관한 뒤 삭제합니다. 계정과
        커뮤니티 데이터는 서비스 제공, 분쟁 대응과 법적 의무에 필요한 기간 동안 보관하고 목적이
        끝나면 삭제하는 것을 원칙으로 합니다.
      </Section>
      <Section title="문의와 변경">
        {contactEmail ? (
          <>열람·정정·삭제 또는 개인정보 관련 문의는 <a className="text-accent-blue" href={`mailto:${contactEmail}`}>{contactEmail}</a>로 접수할 수 있습니다.</>
        ) : (
          <>정식 운영 전 개인정보 문의용 이메일을 공개할 예정입니다. 연락처가 설정되기 전에는 이메일·푸시 구독처럼 새로운 개인정보 수집 실험을 시작하지 않습니다.</>
        )}
        {' '}처리 항목이나 외부 서비스가 바뀌면 이 페이지의 검토일과 내용을 갱신합니다.
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-text-secondary">{children}</p>
    </section>
  );
}
