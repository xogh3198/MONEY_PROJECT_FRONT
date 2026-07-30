import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: '홍보 영상 스튜디오 | 홍보지도' },
  description: '홍보 대상의 근거를 입력해 30~45초 대본, 큰 자막과 7개 장면을 만들고 사람이 검수하는 비공개 스튜디오입니다.',
  robots: { index: false, follow: false },
};

export default function ContentStudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
