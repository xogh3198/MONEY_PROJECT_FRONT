export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  formula?: string;
  example?: string;
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: string;
  readMinutes: number;
  updatedAt: string;
  keywords: string[];
  relatedHref: string;
  relatedLabel: string;
  sources?: Array<{ label: string; url: string }>;
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'exchange-rate-overseas-stock-return',
    title: '환율이 해외주식 수익률에 미치는 영향 계산법',
    description: '해외주식 가격 변화와 원/달러 환율 변화를 분리해 원화 기준 수익률을 읽는 방법을 설명합니다.',
    category: '환율',
    readMinutes: 5,
    updatedAt: '2026-07-22',
    keywords: ['환율', '해외주식 수익률', '원달러 환율', '환차익', '환차손'],
    relatedHref: '/tools',
    relatedLabel: '현재 환율 계산기 사용하기',
    sections: [
      {
        heading: '원화 수익률에는 두 가지 변화가 들어간다',
        paragraphs: [
          '미국 주식의 달러 가격이 그대로여도 원/달러 환율이 바뀌면 원화로 환산한 평가금액은 달라집니다. 반대로 주가가 올라도 원화가 강해지면 원화 기준 수익률은 달러 기준 수익률보다 낮아질 수 있습니다.',
          '따라서 해외자산 성과를 볼 때는 자산 가격 효과와 환율 효과를 분리해야 어떤 위험을 감수해 결과가 나왔는지 이해하기 쉽습니다.',
        ],
        formula: '원화 평가금액 = 보유 수량 × 현재 달러 가격 × 현재 원/달러 환율',
      },
      {
        heading: '간단한 예시',
        paragraphs: ['매수 시점과 현재 시점의 주가·환율을 각각 곱해 원화 평가금액을 구한 뒤 비교합니다. 수수료와 세금은 별도이므로 실제 거래 결과와는 차이가 날 수 있습니다.'],
        example: '주가가 100달러에서 105달러로 5% 상승하고 환율이 1,300원에서 1,365원으로 5% 상승했다면, 원화 평가금액은 130,000원에서 143,325원으로 약 10.25% 증가합니다. 5%와 5%를 단순히 더한 10%와 조금 다른 이유는 두 변화가 곱해지기 때문입니다.',
      },
      {
        heading: '확인할 체크리스트',
        paragraphs: ['짧은 기간의 환율 변화만 보고 장기 수익을 단정하지 말고, 투자 목적과 환전 시점도 함께 확인해야 합니다.'],
        bullets: ['달러 기준 수익률과 원화 기준 수익률을 구분했는가', '매수·매도 환율과 환전 수수료를 반영했는가', '환율 변화가 주가 손실을 가리고 있지는 않은가', '생활비처럼 특정 시점에 달러가 필요한 목적이 있는가'],
      },
    ],
  },
  {
    slug: 'rate-change-loan-interest',
    title: '금리 0.25%p 변화가 대출이자에 미치는 영향',
    description: '기준금리 발표와 실제 대출금리 적용을 구분하고 연간 이자 변화를 빠르게 추정하는 방법입니다.',
    category: '금리',
    readMinutes: 5,
    updatedAt: '2026-07-22',
    keywords: ['금리 인상', '대출이자 계산', '기준금리', '변동금리', '0.25%p'],
    relatedHref: '/calendar',
    relatedLabel: '다음 금리 일정 확인하기',
    sections: [
      {
        heading: '0.25%와 0.25%p는 다르다',
        paragraphs: ['대출금리가 4.00%에서 4.25%로 바뀌면 0.25%포인트 상승한 것입니다. 기존 금리 4.00%의 0.25%만큼 오른 것과는 의미가 다릅니다.'],
        formula: '단순 연간 이자 변화 추정 = 남은 원금 × 금리 변화폭',
      },
      {
        heading: '빠르게 계산하는 예시',
        paragraphs: ['원금이 일정하다고 가정한 단순 추정치입니다. 원리금균등·원금균등 상환처럼 매달 원금이 줄어드는 대출은 실제 증가액이 달라집니다.'],
        example: '남은 원금 2억원의 적용금리가 0.25%p 오른다면 단순 연간 이자 증가는 약 50만원, 월평균 약 4만1,700원입니다. 실제 청구액은 상환방식과 적용일에 따라 달라집니다.',
      },
      {
        heading: '기준금리 발표 직후 바로 바뀌지 않을 수 있다',
        paragraphs: ['대출금리는 기준금리 외에도 코픽스·은행채 같은 기준지표, 가산금리, 우대금리, 재산정 주기의 영향을 받습니다. 따라서 중앙은행 발표일과 내 대출 적용일은 다를 수 있습니다.'],
        bullets: ['고정금리인지 변동금리인지', '금리 재산정 주기가 언제인지', '어떤 기준지표를 사용하는지', '중도상환수수료와 갈아타기 비용이 있는지'],
      },
    ],
  },
  {
    slug: 'dividend-yield-checklist',
    title: '배당수익률만 보고 투자하면 놓치기 쉬운 것들',
    description: '표시 배당수익률, 배당락, 지급 지속 가능성, 세후 현금흐름을 함께 확인하는 체크리스트입니다.',
    category: '배당',
    readMinutes: 6,
    updatedAt: '2026-07-22',
    keywords: ['배당수익률', '배당락', '세후 배당금', '배당주', '현금흐름'],
    relatedHref: '/tools',
    relatedLabel: '배당금 계산 도구 열기',
    sections: [
      {
        heading: '배당수익률은 가격과 배당금의 비율이다',
        paragraphs: ['표시된 배당수익률이 높아진 이유가 배당금 증가인지, 주가 하락인지 먼저 구분해야 합니다. 주가가 크게 떨어지면 배당금이 그대로여도 과거 기준 수익률은 높아 보일 수 있습니다.'],
        formula: '단순 배당수익률 = 주당 배당금 ÷ 현재 주가 × 100',
      },
      {
        heading: '현금 지급과 총수익은 다르다',
        paragraphs: ['배당을 받았다는 사실만으로 같은 금액의 수익이 확정되는 것은 아닙니다. 배당락 전후 가격 변화와 세금, 환율, 거래비용을 합친 총수익으로 봐야 합니다.'],
        bullets: ['최근 한 번의 특별배당이 반복 배당처럼 표시되지 않았는가', '이익과 현금흐름으로 배당을 감당할 수 있는가', '배당 기준일과 실제 지급일을 구분했는가', '세후 수령액과 환전 비용을 확인했는가'],
      },
      {
        heading: '비교할 때 기준을 통일한다',
        paragraphs: ['서로 다른 종목이나 계좌를 비교할 때는 같은 기간, 같은 통화, 같은 세전·세후 기준을 사용해야 합니다. 배당만이 아니라 가격 변동과 재투자 여부도 함께 기록하면 실제 성과를 더 정확히 이해할 수 있습니다.'],
      },
    ],
  },
  {
    slug: 'news-engagement-metrics',
    title: '뉴스 조회수·댓글·좋아요로 인기도를 읽는 방법',
    description: '플랫폼마다 다른 참여 수치를 합산하면 왜 오해가 생기는지, 최신성·검색 관심도와 함께 읽는 방법을 설명합니다.',
    category: '데이터 읽기',
    readMinutes: 6,
    updatedAt: '2026-07-22',
    keywords: ['뉴스 조회수', '댓글수', '좋아요', '인기뉴스', '검색 트렌드'],
    relatedHref: '/briefing',
    relatedLabel: '오늘의 데이터 브리핑 보기',
    sections: [
      {
        heading: '같은 숫자처럼 보여도 모집단이 다르다',
        paragraphs: ['언론사 원문의 조회수, 포털 댓글 수, InvestBoard 내부 조회수는 서로 다른 사용자가 다른 화면에서 만든 값입니다. 이를 하나의 조회수처럼 더하면 실제보다 큰 숫자로 오해할 수 있습니다.', 'InvestBoard는 내부 반응과 외부 공개 반응을 분리해 표시하고, 외부 수치의 제공처와 갱신 시각을 함께 기록합니다.'],
      },
      {
        heading: '조회수는 관심, 댓글은 논쟁을 더 많이 반영할 수 있다',
        paragraphs: ['조회수가 높다고 내용에 동의한다는 뜻은 아니며, 댓글이 많다고 중요한 금융 이슈라는 뜻도 아닙니다. 강한 감정이나 논쟁적인 제목이 댓글을 늘릴 수 있으므로 금융 관련성·최신성·시장지표 연결성을 함께 봐야 합니다.'],
        bullets: ['발행 후 얼마나 시간이 지났는가', '조회 대비 댓글·반응 비율이 비정상적으로 높은가', '실제 시장지표 변화와 연결되는가', '검색 관심도가 하루짜리 급증인지 지속 추세인지'],
      },
      {
        heading: '수치를 제공하지 않는 플랫폼은 추정하지 않는다',
        paragraphs: ['공식 API에 수치가 없거나 robots 정책이 자동 수집을 막는 경우에는 화면을 우회해 숫자를 가져오지 않습니다. 대신 공식 검색 관심도, 공개 구조화 데이터, 사이트 내부의 실제 반응처럼 출처가 확인되는 신호만 사용합니다.'],
      },
    ],
  },
  {
    slug: 'compound-interest-time',
    title: '복리 계산에서 수익률보다 시간이 중요한 이유',
    description: '원금과 누적 수익에 다시 수익이 붙는 복리 구조를 계산하고, 수익률 가정을 과신하지 않는 방법입니다.',
    category: '기초 계산',
    readMinutes: 5,
    updatedAt: '2026-07-30',
    keywords: ['복리 계산', '복리 공식', '장기 투자', '연복리', '투자 기간'],
    relatedHref: '/tools',
    relatedLabel: '투자 계산 도구 보기',
    sources: [
      { label: '미국 SEC Investor.gov 복리 계산기', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    ],
    sections: [
      {
        heading: '복리는 원금과 이전 수익을 함께 굴리는 구조다',
        paragraphs: ['단리는 처음 원금에만 같은 수익이 붙지만 복리는 앞선 기간의 수익도 다음 계산의 원금에 포함합니다. 같은 연 수익률이라도 기간이 길수록 두 방식의 차이가 커집니다.'],
        formula: '미래가치 = 현재금액 × (1 + 기간수익률)ⁿ',
      },
      {
        heading: '수익률 가정이 조금만 달라도 결과는 크게 달라진다',
        paragraphs: ['복리 계산은 미래를 예측하는 값이 아니라 가정을 비교하는 도구입니다. 투자 수익률은 고정되지 않고 손실 구간도 있으므로 한 가지 높은 수익률만 넣은 결과를 목표금액처럼 받아들이면 안 됩니다.'],
        example: '1,000만원을 추가 납입 없이 연 5%로 10년 복리 계산하면 약 1,629만원입니다. 같은 기간 연 3% 가정은 약 1,344만원으로, 가정 차이가 누적됩니다.',
      },
      {
        heading: '계산 전에 확인할 것',
        paragraphs: ['세금, 수수료, 물가와 중간 인출은 단순 복리 계산에서 빠지기 쉽습니다.'],
        bullets: ['표시 수익률이 세전인지 세후인지', '운용보수와 거래비용을 뺐는지', '매달 납입 시점을 월초·월말 중 무엇으로 가정했는지', '손실 가능성과 변동성을 별도로 확인했는지'],
      },
    ],
  },
  {
    slug: 'real-return-after-inflation',
    title: '명목수익률에서 물가를 뺀 실질수익률 계산법',
    description: '계좌 숫자가 늘었어도 구매력이 줄 수 있는 이유와 물가를 반영한 실질수익률을 계산합니다.',
    category: '물가',
    readMinutes: 5,
    updatedAt: '2026-07-30',
    keywords: ['실질수익률', '명목수익률', '물가상승률', '구매력', '소비자물가지수'],
    relatedHref: '/market',
    relatedLabel: '시장지표 확인하기',
    sources: [
      { label: '국가통계연구원 소비자물가 통계정보보고서', url: 'https://sri.kostat.go.kr/boardDownload.es?bid=12030&list_no=442868&seq=1' },
    ],
    sections: [
      {
        heading: '명목금액과 구매력은 다르다',
        paragraphs: ['명목수익률은 계좌에 표시된 금액 변화를 말합니다. 같은 기간 상품과 서비스 가격이 오르면 늘어난 돈으로 살 수 있는 양은 수익률만큼 증가하지 않을 수 있습니다. 소비자물가지수는 가구가 구입하는 상품·서비스의 전반적인 가격 수준 변화를 보는 대표 지표입니다.'],
      },
      {
        heading: '정확한 실질수익률은 단순 뺄셈과 조금 다르다',
        paragraphs: ['수익률과 물가상승률이 작을 때는 명목수익률에서 물가상승률을 뺀 값이 빠른 근삿값입니다. 비교 기간과 기준 통화를 같게 맞춰야 합니다.'],
        formula: '실질수익률 = (1 + 명목수익률) ÷ (1 + 물가상승률) - 1',
        example: '명목수익률 6%, 같은 기간 물가상승률 3%라면 실질수익률은 약 2.91%입니다. 단순히 뺀 3%와 약간 다릅니다.',
      },
      {
        heading: '개인 체감물가는 다를 수 있다',
        paragraphs: ['공식 소비자물가는 평균적인 품목 바구니를 사용합니다. 주거비, 교육비, 의료비처럼 개인이 많이 쓰는 항목이 다르면 체감 구매력 변화도 달라질 수 있습니다.'],
        bullets: ['수익률과 물가의 측정 기간이 같은가', '세금·수수료를 차감한 수익률인가', '외화자산이면 환율 효과를 분리했는가', '내 주요 지출 항목의 가격 변화를 별도로 확인했는가'],
      },
    ],
  },
  {
    slug: 'regular-investing-average-cost',
    title: '정기적립식 투자의 평균매입단가를 읽는 방법',
    description: '같은 금액을 정기적으로 투자할 때 가격에 따라 매수 수량과 평균단가가 어떻게 달라지는지 계산합니다.',
    category: '투자 습관',
    readMinutes: 5,
    updatedAt: '2026-07-30',
    keywords: ['적립식 투자', '평균매입단가', '분할매수', '정액 투자', 'DCA'],
    relatedHref: '/guides',
    relatedLabel: '다른 금융 가이드 보기',
    sources: [
      { label: '미국 SEC Investor.gov 정액 분할투자 정의', url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging' },
    ],
    sections: [
      {
        heading: '같은 금액이면 가격이 낮을 때 더 많이 산다',
        paragraphs: ['정액 분할투자는 시장 등락과 관계없이 같은 금액을 일정 간격으로 투입하는 방식입니다. 가격이 낮을 때 수량을 더 많이 사고 가격이 높을 때 적게 사므로 매수 시점을 한 번에 맞혀야 하는 부담을 줄일 수 있습니다.'],
        formula: '평균매입단가 = 총투입금액 ÷ 총보유수량',
      },
      {
        heading: '평균단가가 낮아져도 손실 위험은 사라지지 않는다',
        paragraphs: ['가격이 계속 하락하면 평균단가보다 현재 가격이 낮을 수 있습니다. 투자 대상 자체의 가치가 훼손된 경우 정기매수는 손실 규모를 키울 수도 있습니다.'],
        example: '매달 10만원씩 가격 10,000원, 8,000원, 12,000원에 매수하면 각각 10주, 12.5주, 약 8.33주를 사 총 약 30.83주입니다. 평균단가는 약 9,731원입니다.',
      },
      {
        heading: '전략이 아니라 실행 규칙으로 본다',
        paragraphs: ['정액 분할투자는 미래 수익을 보장하는 종목 선택법이 아니라 투자 시점을 나누는 실행 규칙입니다.'],
        bullets: ['투자 대상의 비용과 위험을 이해했는가', '생활비와 단기 필요자금을 분리했는가', '거래 수수료가 반복 매수 효과를 깎지 않는가', '중단·재검토 기준을 정했는가'],
      },
    ],
  },
  {
    slug: 'bond-price-interest-rate',
    title: '금리가 오르면 채권 가격이 내려가는 이유',
    description: '고정금리 채권의 쿠폰, 시장금리, 만기와 가격 관계를 직관적인 비교로 설명합니다.',
    category: '금리',
    readMinutes: 6,
    updatedAt: '2026-07-30',
    keywords: ['채권 가격', '금리 상승', '쿠폰 금리', '만기수익률', '금리 위험'],
    relatedHref: '/calendar',
    relatedLabel: '금리 일정 확인하기',
    sources: [
      { label: '미국 SEC Investor.gov 금리와 고정금리 채권 가격', url: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86' },
    ],
    sections: [
      {
        heading: '기존 채권은 새 채권과 경쟁한다',
        paragraphs: ['고정 쿠폰 3%인 채권을 보유한 상태에서 비슷한 위험의 새 채권이 4%를 지급하면, 기존 채권을 같은 가격에 살 유인이 줄어듭니다. 기존 채권은 더 낮은 가격에 거래돼 새 시장금리와 비슷한 수익률을 제공하게 됩니다.'],
      },
      {
        heading: '금리와 고정금리 채권 가격은 일반적으로 반대로 움직인다',
        paragraphs: ['시장금리가 오르면 고정금리 채권 가격은 내려가고, 시장금리가 내리면 기존 고정 쿠폰의 매력이 커져 가격이 오르는 경향이 있습니다. 채권을 만기 전에 팔 때는 액면가보다 높거나 낮은 가격을 받을 수 있습니다.'],
        formula: '시장금리 상승 → 기존 고정금리 채권 가격 하락 경향',
      },
      {
        heading: '만기가 길수록 금리 변화에 더 민감할 수 있다',
        paragraphs: ['같은 신용위험과 쿠폰 조건이라면 만기까지 남은 기간이 긴 채권은 금리 변화의 영향을 받을 시간이 더 깁니다.'],
        bullets: ['만기까지 보유할지 중간에 매도할지', '쿠폰금리와 만기수익률을 구분했는지', '발행자의 신용위험을 확인했는지', '금리 외에 물가·유동성·중도상환 위험이 있는지'],
      },
    ],
  },
  {
    slug: 'etf-nav-premium-discount',
    title: 'ETF 시장가격과 NAV 괴리율을 확인하는 방법',
    description: 'ETF의 거래가격이 순자산가치보다 높거나 낮을 수 있는 이유와 매수 전 확인 항목을 설명합니다.',
    category: 'ETF',
    readMinutes: 6,
    updatedAt: '2026-07-30',
    keywords: ['ETF 괴리율', 'ETF NAV', 'ETF 프리미엄', 'ETF 할인', 'iNAV'],
    relatedHref: '/market',
    relatedLabel: '시장지표 확인하기',
    sources: [
      { label: '한국거래소 ETF 발행제도', url: 'https://regulation.krx.co.kr/contents/RGL/03/03060106/RGL03060106.jsp' },
      { label: '미국 SEC Investor.gov ETF 비용·NAV 안내', url: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/mutual-fund-and-etf-fees-and-expenses-investor-bulletin' },
    ],
    sections: [
      {
        heading: 'ETF에는 장중 시장가격과 순자산가치가 있다',
        paragraphs: ['ETF는 거래소에서 실시간으로 사고팔기 때문에 시장가격이 형성됩니다. 동시에 펀드가 보유한 자산의 가치를 기준으로 순자산가치(NAV)가 계산됩니다. 두 값은 항상 정확히 같지는 않습니다.'],
      },
      {
        heading: '괴리율은 비싸게 또는 싸게 거래되는 정도다',
        paragraphs: ['시장가격이 NAV보다 높으면 프리미엄, 낮으면 할인 상태라고 합니다. 해외 기초자산의 거래시간 차이, 급격한 변동, 유동성 저하 등으로 괴리가 커질 수 있습니다.'],
        formula: '괴리율 = (ETF 시장가격 - NAV) ÷ NAV × 100',
        example: 'NAV가 10,000원인데 시장가격이 10,300원이면 약 +3% 프리미엄입니다. 기초자산 가치가 그대로여도 괴리가 정상화되면 손실이 날 수 있습니다.',
      },
      {
        heading: '총보수만으로 실제 비용을 다 알 수 없다',
        paragraphs: ['운용보수 외에도 매매 수수료, 호가 차이, 추적오차, NAV 대비 프리미엄·할인이 실제 결과에 영향을 줍니다.'],
        bullets: ['최근 괴리율과 거래량을 확인했는가', '해외 시장이 닫힌 시간의 가격인지', '총보수와 추적오차를 함께 봤는가', '레버리지·인버스·파생형 구조인지'],
      },
    ],
  },
  {
    slug: 'diversification-correlation',
    title: '분산투자가 손실을 없애지 못하는 이유',
    description: '종목 수보다 자산 간 상관관계와 공통 위험을 봐야 하는 이유를 체크리스트로 정리합니다.',
    category: '위험관리',
    readMinutes: 5,
    updatedAt: '2026-07-30',
    keywords: ['분산투자', '상관관계', '포트폴리오 위험', '집중투자', '자산배분'],
    relatedHref: '/market',
    relatedLabel: '서로 다른 시장지표 비교하기',
    sources: [
      { label: '미국 SEC Investor.gov 분산투자 안내', url: 'https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/diversify-your-investments' },
    ],
    sections: [
      {
        heading: '종목이 많아도 같은 위험에 묶일 수 있다',
        paragraphs: ['서로 다른 종목을 여러 개 보유해도 같은 업종, 국가, 통화, 금리 요인에 크게 의존하면 비슷한 시점에 함께 하락할 수 있습니다. 분산은 이름의 개수보다 손익을 움직이는 원인이 얼마나 다른지 보는 문제입니다.'],
      },
      {
        heading: '상관관계는 고정값이 아니다',
        paragraphs: ['평소에는 다르게 움직이던 자산도 시장 충격 때 동시에 하락할 수 있습니다. 과거 상관관계만 보고 손실 한도를 확정적으로 계산하면 위험을 과소평가할 수 있습니다.'],
        formula: '포트폴리오 위험은 각 자산의 변동성과 자산 사이의 동행 정도에 함께 영향을 받습니다.',
      },
      {
        heading: '분산은 손실 제거가 아니라 집중 위험 완화다',
        paragraphs: ['시장 전체가 하락하면 분산된 포트폴리오도 손실이 날 수 있습니다. 현금이 필요한 시점과 감당 가능한 손실 범위를 먼저 정해야 합니다.'],
        bullets: ['종목뿐 아니라 업종·국가·통화가 겹치지 않는가', 'ETF 여러 개가 같은 상위 종목을 반복 보유하지 않는가', '단기 필요자금이 고변동 자산에 들어가 있지 않은가', '정기적으로 비중을 확인할 기준이 있는가'],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find(guide => guide.slug === slug);
}
