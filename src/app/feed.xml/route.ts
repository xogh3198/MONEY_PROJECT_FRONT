import { GUIDES } from '@/lib/guides';

const SITE_URL = 'https://investboard.cloud';

export function GET() {
  const items = [
    {
      title: '오늘의 1분 머니 브리핑',
      link: `${SITE_URL}/briefing`,
      description: '인기 금융 뉴스와 시장지표, 공개 관심 신호를 연결해 오늘 확인할 세 가지 변수를 설명합니다.',
      pubDate: new Date().toUTCString(),
    },
    ...GUIDES.map(guide => ({
      title: guide.title,
      link: `${SITE_URL}/guides/${guide.slug}`,
      description: [guide.description, ...guide.sections.flatMap(section => [section.heading, ...section.paragraphs])].join('\n\n'),
      pubDate: new Date(guide.updatedAt).toUTCString(),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>InvestBoard 금융 데이터 가이드</title>
    <link>${SITE_URL}</link>
    <description>오늘 내 돈에 영향을 주는 금융 데이터와 원본 설명 콘텐츠</description>
    <language>ko-KR</language>
    ${items.map(item => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <description><![CDATA[${safeCdata(item.description)}]]></description>
      <pubDate>${item.pubDate}</pubDate>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=900, s-maxage=900',
    },
  });
}

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function safeCdata(value: string): string {
  return value.replace(/]]>/g, ']]]]><![CDATA[>');
}
