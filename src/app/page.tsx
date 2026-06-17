import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-5">
      <MarketTicker />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <NewsList />
        <Sidebar />
      </div>
    </div>
  );
}

function MarketTicker() {
  return (
    <section className="bg-white rounded border border-[#e4e4e4]">
      <div className="px-5 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-[#333]">주요 시장지표</h2>
        <Link href="/market" className="text-[12px] text-[#999] hover:text-[#03c75a]">
          더보기
        </Link>
      </div>
      <div className="grid grid-cols-5 divide-x divide-[#f0f0f0]">
        <IndexCard name="코스피" value="2,847.52" change="+34.67" percent="+1.23%" up={true} />
        <IndexCard name="코스닥" value="892.15" change="-4.02" percent="-0.45%" up={false} />
        <IndexCard name="원/달러" value="1,342.50" change="+1.60" percent="+0.12%" up={true} />
        <IndexCard name="S&P500" value="5,892.30" change="+39.27" percent="+0.67%" up={true} />
        <IndexCard name="비트코인" value="$98,452" change="-2,103" percent="-2.10%" up={false} />
      </div>
    </section>
  );
}

function IndexCard({ name, value, change, percent, up }: {
  name: string; value: string; change: string; percent: string; up: boolean;
}) {
  return (
    <div className="px-4 py-4 text-center">
      <div className="text-[12px] text-[#888] mb-1">{name}</div>
      <div className="text-[18px] font-bold text-[#333]">{value}</div>
      <div className={`text-[13px] font-medium mt-0.5 ${up ? 'text-[#d63031]' : 'text-[#0984e3]'}`}>
        {up ? '▲' : '▼'} {change} ({percent})
      </div>
    </div>
  );
}

function NewsList() {
  const news = [
    { title: '한은, 기준금리 3.0% 동결..."하반기 인하 검토"', source: '한국경제', time: '2시간 전', comments: 56 },
    { title: '삼성전자, AI 반도체 수주 급증...2분기 어닝서프라이즈', source: '매일경제', time: '3시간 전', comments: 124 },
    { title: '원/달러 환율 1,350원 돌파...달러 강세 지속', source: '연합뉴스', time: '4시간 전', comments: 38 },
    { title: '비트코인 10만 달러 재도전, 기관 ETF 매수 지속', source: '코인데스크', time: '5시간 전', comments: 92 },
    { title: '나스닥 사상 최고치 경신...엔비디아 10% 급등', source: '서울경제', time: '6시간 전', comments: 67 },
    { title: '한국 수출 5개월 연속 증가, 반도체 36% 성장', source: '한국경제', time: '7시간 전', comments: 29 },
    { title: '미 연준 위원 "9월 인하 시기상조" 발언에 증시 혼조', source: '연합뉴스', time: '8시간 전', comments: 44 },
  ];

  return (
    <section className="bg-white rounded border border-[#e4e4e4]">
      <div className="px-5 py-3 border-b border-[#f0f0f0] flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-[#333]">오늘의 경제뉴스</h2>
        <Link href="/forum" className="text-[12px] text-[#999] hover:text-[#03c75a]">
          전체보기
        </Link>
      </div>
      <ul>
        {news.map((item, i) => (
          <li key={i} className="px-5 py-3 border-b border-[#f9f9f9] last:border-0 hover:bg-[#fafafa] cursor-pointer">
            <p className="text-[14px] text-[#333] font-medium leading-snug mb-1">{item.title}</p>
            <div className="flex items-center gap-2 text-[12px] text-[#999]">
              <span>{item.source}</span>
              <span>·</span>
              <span>{item.time}</span>
              <span className="ml-auto">💬 {item.comments}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Sidebar() {
  const ranks = [
    { title: '하반기 금리 인하 확실한가?', comments: 42 },
    { title: '삼성전자 10만원 가능?', comments: 87 },
    { title: '비트코인 연말 15만 달러?', comments: 56 },
    { title: '환율 1,400원 돌파 시나리오', comments: 31 },
    { title: '2분기 실적 시즌 유망주는?', comments: 24 },
  ];

  const dividends = [
    { stock: '삼성전자', date: '06/25', amount: '361원/주', dDay: 'D-8' },
    { stock: 'SK하이닉스', date: '06/25', amount: '1,200원/주', dDay: 'D-8' },
    { stock: '현대차', date: '06/28', amount: '3,000원/주', dDay: 'D-11' },
  ];

  return (
    <aside className="space-y-5">
      <div className="bg-white rounded border border-[#e4e4e4]">
        <div className="px-4 py-3 border-b border-[#f0f0f0]">
          <h3 className="text-[13px] font-bold text-[#333]">인기 토론</h3>
        </div>
        <ul className="py-2">
          {ranks.map((item, i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-[#fafafa] cursor-pointer">
              <span className={`w-5 text-center text-[12px] font-bold ${i < 3 ? 'text-[#03c75a]' : 'text-[#ccc]'}`}>
                {i + 1}
              </span>
              <span className="flex-1 text-[13px] text-[#333] truncate">{item.title}</span>
              <span className="text-[11px] text-[#bbb]">{item.comments}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded border border-[#e4e4e4]">
        <div className="px-4 py-3 border-b border-[#f0f0f0]">
          <h3 className="text-[13px] font-bold text-[#333]">다가오는 배당</h3>
        </div>
        <ul className="py-2 px-4 space-y-2">
          {dividends.map((item, i) => (
            <li key={i} className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-[13px] text-[#333] font-medium">{item.stock}</span>
                <span className="text-[11px] text-[#999] ml-2">{item.date}</span>
              </div>
              <div className="text-right">
                <span className="text-[12px] text-[#333]">{item.amount}</span>
                <span className="text-[11px] text-[#d63031] ml-2">{item.dDay}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-4 pb-3">
          <Link href="/dividend" className="block text-center py-2 text-[12px] text-[#03c75a] border border-[#03c75a] rounded hover:bg-[#03c75a] hover:text-white transition-colors">
            배당 캘린더 보기
          </Link>
        </div>
      </div>
    </aside>
  );
}
