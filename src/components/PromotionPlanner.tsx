"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  createPromotionPlan,
  createWebsiteAnalysis,
  PromotionBrief,
  PromotionPlan,
  PromotionSourceType,
  WebsiteAnalysis
} from "@/lib/promotion-map";
import type { PromotionVideoInput } from "@/lib/content-studio";
import { trackGrowthEvent } from "@/lib/growth-analytics";

const VIDEO_HANDOFF_STORAGE = "promotion_map_video_handoff_v1";

const goals = [
  { value: "상담 문의", label: "상담 문의" },
  { value: "방문", label: "매장 방문" },
  { value: "가입", label: "회원가입" },
  { value: "구매", label: "구매" },
  { value: "인지도", label: "인지도" }
];

const capabilityOptions = ["글 작성", "이미지 제작", "직접 출연", "촬영", "영상 편집"];

const sourceOptions: Array<{
  value: PromotionSourceType;
  label: string;
  description: string;
}> = [
  { value: "URL", label: "웹사이트·링크", description: "홈페이지, 플레이스, 앱스토어, 공개 콘텐츠" },
  { value: "TEXT", label: "소개글", description: "아이디어나 사업 설명만 있어도 시작" },
  { value: "PRODUCT", label: "상품·서비스", description: "판매할 상품과 고객 문제 중심" },
  { value: "PLACE", label: "매장·장소", description: "지역, 방문, 예약 목표 중심" },
  { value: "APP", label: "앱", description: "설치·가입을 만드는 메시지 중심" },
  { value: "CONTENT", label: "콘텐츠", description: "글·영상·뉴스레터를 재홍보" },
];

const won = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
  maximumFractionDigits: 0
});

type Stage = "url" | "brief" | "result";

const stageItems: { id: Stage; number: string; label: string }[] = [
  { id: "url", number: "01", label: "대상 확인" },
  { id: "brief", number: "02", label: "조건 정리" },
  { id: "result", number: "03", label: "실행지도" }
];

export default function PromotionPlanner() {
  const [stage, setStage] = useState<Stage>("url");
  const [sourceType, setSourceType] = useState<PromotionSourceType>("URL");
  const [url, setUrl] = useState("");
  const [sourceTitle, setSourceTitle] = useState("");
  const [description, setDescription] = useState("");
  const [referenceLinks, setReferenceLinks] = useState("");
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [plan, setPlan] = useState<PromotionPlan | null>(null);
  const [goal, setGoal] = useState("상담 문의");
  const [targetAudience, setTargetAudience] = useState("사이트의 핵심 고객");
  const [targetRegion, setTargetRegion] = useState("전국");
  const [monthlyBudget, setMonthlyBudget] = useState(300000);
  const [capabilities, setCapabilities] = useState<string[]>(["글 작성"]);
  const [pricingInterest, setPricingInterest] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const progress = useMemo(() => {
    if (stage === "url") return 25;
    if (stage === "brief") return 60;
    return 100;
  }, [stage]);

  async function handleAnalyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      const nextAnalysis = await createWebsiteAnalysis({
        sourceType,
        url: url.trim() || undefined,
        title: sourceTitle.trim() || undefined,
        description: description.trim() || undefined,
        referenceLinks: referenceLinks
          .split(/\r?\n/)
          .map((item) => item.trim())
          .filter(Boolean),
      });
      setAnalysis(nextAnalysis);
      setTargetAudience(nextAnalysis.targetAudienceHypotheses[0] ?? "사이트의 핵심 고객");
      setTargetRegion(nextAnalysis.serviceRegions[0] ?? "전국");
      setStage("brief");
      trackGrowthEvent("promotion_source_analyzed", {
        source_type: sourceType,
        has_url: Boolean(url.trim()),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "분석 요청에 실패했습니다.");
    } finally {
      setPending(false);
    }
  }

  async function handlePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!analysis) return;

    setError("");
    setPending(true);

    const brief: PromotionBrief = {
      analysisId: analysis.analysisId,
      goal,
      targetAudience,
      targetRegion,
      monthlyBudget,
      productionCapabilities: capabilities
    };

    try {
      const nextPlan = await createPromotionPlan(brief);
      setPlan(nextPlan);
      setStage("result");
      trackGrowthEvent("promotion_plan_created", {
        source_type: sourceType,
        goal,
        budget_band: budgetBand(monthlyBudget),
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "계획 생성에 실패했습니다.");
    } finally {
      setPending(false);
    }
  }

  function toggleCapability(capability: string) {
    setCapabilities((current) =>
      current.includes(capability)
        ? current.filter((item) => item !== capability)
        : [...current, capability]
    );
  }

  function reset() {
    setStage("url");
    setAnalysis(null);
    setPlan(null);
    setError("");
  }

  function openVideoStudio() {
    if (!analysis || !plan) return;
    const references = [
      url.trim(),
      analysis.canonicalUrl,
      ...referenceLinks.split(/\r?\n/).map(item => item.trim()),
    ].filter((value, index, values) => Boolean(value) && values.indexOf(value) === index);
    const facts = analysis.evidence.map(item => `${item.label}: ${item.value}`);
    const input: PromotionVideoInput = {
      sourceType,
      title: sourceTitle.trim() || analysis.title,
      description: [
        description.trim() || analysis.sourceSummary,
        `홍보 계획: ${plan.strategySummary}`,
      ].filter(Boolean).join('\n\n'),
      sourceUrl: url.trim() || analysis.canonicalUrl || undefined,
      referenceLinks: references,
      targetAudience,
      goal,
      callToAction: analysis.primaryCtas[0] || goalCallToAction(goal),
      verifiedFacts: facts,
      ownedAssetNotes: '',
    };
    sessionStorage.setItem(VIDEO_HANDOFF_STORAGE, JSON.stringify({
      input,
      planId: plan.planId,
    }));
    trackGrowthEvent("promotion_plan_to_studio", {
      source_type: sourceType,
      goal,
      plan_id: plan.planId,
    });
    window.location.href = "/promotion-map/studio?utm_source=marketing-map-plan&utm_medium=internal&utm_campaign=marketing-map-video";
  }

  function recordPricingInterest(option: string) {
    setPricingInterest(option);
    trackGrowthEvent("promotion_pricing_interest", {
      option,
      source_type: sourceType,
      goal,
    });
  }

  const activeStageIndex = stageItems.findIndex((item) => item.id === stage);

  return (
    <main className="promotion-root site-page">
      <header className="topbar">
        <a className="brand" href="/promotion-map" aria-label="마케팅맵 홈">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span className="brand-copy">
            <strong>마케팅맵</strong>
            <small>MARKETING MAP</small>
          </span>
        </a>
        <nav className="product-nav" aria-label="제품 메뉴">
          <Link href="/">홈</Link>
          <a href="/forum?utm_source=marketing-map-nav&utm_medium=internal&utm_campaign=product-navigation">
            InvestingBoard
          </a>
          <a href="/promotion-map?utm_source=marketing-map-nav&utm_medium=internal&utm_campaign=product-navigation">
            마케팅맵
          </a>
        </nav>
        <a className="product-top-cta" href="/promotion-map/studio?utm_source=marketing-map-nav&utm_medium=internal&utm_campaign=marketing-map-video">
          영상 만들기 ↗
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <span aria-hidden="true">✦</span>
            URL에서 실행까지, 한 장의 지도
          </p>
          <h1>
            홍보의 다음 한 걸음,
            <br />
            <em>지도처럼 선명하게.</em>
          </h1>
          <p className="hero-description">
            내 사이트의 목표와 예산을 확인한 뒤, 지금 먼저 갈 채널부터 이번 주 할 일까지
            이유와 비용을 붙여 한 장에 정리합니다.
          </p>
          <div className="hero-actions">
            <a className="hero-primary" href="#planner">
              무료로 실행지도 만들기
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="hero-note">
            계획과 초안은 무료로 확인 · 게시와 광고 집행은 사용자가 직접 결정
          </p>
          <ul className="hero-points" aria-label="마케팅맵 핵심 결과">
            <li>
              <strong>5+</strong>
              우선 채널
            </li>
            <li>
              <strong>3</strong>
              예산 시나리오
            </li>
            <li>
              <strong>1주</strong>
              실행 순서
            </li>
          </ul>
        </div>

        <div className="map-visual" aria-label="사이트에서 채널로 이어지는 홍보 경로 예시">
          <div className="map-toolbar">
            <span>
              <i aria-hidden="true" />
              이번 주 홍보 경로
            </span>
            <b>LIVE PLAN</b>
          </div>
          <div className="map-canvas" aria-hidden="true">
            <div className="route route-one" />
            <div className="route route-two" />
            <div className="route route-three" />
            <div className="map-center">
              <span>START</span>
              <strong>내 사이트</strong>
            </div>
            <div className="map-node node-search">
              <span>01</span>
              검색
            </div>
            <div className="map-node node-community">
              <span>02</span>
              커뮤니티
            </div>
            <div className="map-node node-short">
              <span>03</span>
              숏폼
            </div>
            <div className="map-note note-cost">
              <small>예상 비용</small>
              <strong>₩0–30만</strong>
            </div>
            <div className="map-note note-action">
              <small>첫 행동</small>
              <strong>질문 3개 정리</strong>
            </div>
            <div className="map-sticker">GO!</div>
          </div>
          <div className="map-footer">
            <span>추천 근거 포함</span>
            <span>검토 후 직접 실행</span>
          </div>
        </div>
      </section>

      <section className="target-strip" aria-labelledby="target-title">
        <div className="target-intro">
          <p className="section-kicker">URL-FIRST, NOT URL-ONLY</p>
          <h2 id="target-title">사이트부터 시작해 더 다양한 홍보 대상으로.</h2>
        </div>
        <div className="target-cards">
          <article className="target-card is-current">
            <span>현재</span>
            <b aria-hidden="true">↗</b>
            <h3>웹사이트·SaaS</h3>
            <p>공개 URL에서 홍보 브리프를 시작합니다.</p>
          </article>
          <article className="target-card">
            <span>다음</span>
            <b aria-hidden="true">⌖</b>
            <h3>매장·공간</h3>
            <p>플레이스, 예약, 방문 행동으로 확장합니다.</p>
          </article>
          <article className="target-card">
            <span>다음</span>
            <b aria-hidden="true">✦</b>
            <h3>상품·서비스</h3>
            <p>판매 링크가 없어도 설명으로 시작합니다.</p>
          </article>
          <article className="target-card">
            <span>예정</span>
            <b aria-hidden="true">◫</b>
            <h3>앱·콘텐츠</h3>
            <p>설치, 구독, 신청 목표까지 연결합니다.</p>
          </article>
        </div>
      </section>

      <section className="planner-shell" id="planner" aria-labelledby="planner-title">
        <div className="planner-progress" aria-label={`계획 생성 ${progress}% 완료`}>
          <div className="progress-meta">
            {stageItems.map((item, index) => (
              <span
                className={index <= activeStageIndex ? "step-label active" : "step-label"}
                key={item.id}
              >
                <b>{item.number}</b>
                {item.label}
              </span>
            ))}
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        {stage === "url" && (
          <div className="planner-grid">
            <div>
              <span className="mini-sticker">STEP 01</span>
              <p className="section-kicker">첫 분석 시작</p>
              <h2 id="planner-title">홍보할 대상을 한 줄로 알려주세요.</h2>
              <p className="muted">
                URL이 없어도 소개글, 상품, 매장, 앱, 기존 콘텐츠로 시작할 수 있습니다.
                입력 근거와 사용자의 확인값을 분리해 홍보 계획과 영상 초안을 만듭니다.
              </p>
              <ul className="planner-benefits">
                <li>
                  <span aria-hidden="true">✓</span>
                  위험한 내부 주소를 먼저 차단
                </li>
                <li>
                  <span aria-hidden="true">✓</span>
                  추정값과 사용자 입력을 분리
                </li>
                <li>
                  <span aria-hidden="true">✓</span>
                  광고비 없이 가능한 방법도 포함
                </li>
              </ul>
            </div>
            <form className="url-form source-form" onSubmit={handleAnalyze} aria-busy={pending}>
              <div className="form-badge-row">
                <span>홍보 대상 접수</span>
                <small>약 10초</small>
              </div>

              <fieldset className="source-type-fieldset">
                <legend>무엇을 홍보하나요?</legend>
                <div className="source-type-grid">
                  {sourceOptions.map((option) => (
                    <label
                      className={sourceType === option.value ? "source-type active" : "source-type"}
                      key={option.value}
                    >
                      <input
                        type="radio"
                        name="sourceType"
                        value={option.value}
                        checked={sourceType === option.value}
                        onChange={() => setSourceType(option.value)}
                      />
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="source-title">
                {sourceType === "URL" ? "대상 이름 (선택)" : "홍보할 대상 이름"}
              </label>
              <input
                id="source-title"
                value={sourceTitle}
                onChange={(event) => setSourceTitle(event.target.value)}
                placeholder={
                  sourceType === "PLACE"
                    ? "예: 송도 로스터리 카페"
                    : sourceType === "APP"
                      ? "예: 투자 기록 앱"
                      : "예: 1인 사업자를 위한 예약 서비스"
                }
                required={sourceType !== "URL" && !description.trim()}
              />

              <label htmlFor="website-url">
                {sourceType === "URL" ? "대표 URL" : "연결할 URL (선택)"}
              </label>
              <div className="input-combo source-url-row">
                <input
                  id="website-url"
                  name="url"
                  type="url"
                  inputMode="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required={sourceType === "URL"}
                  autoComplete="url"
                />
              </div>

              <label htmlFor="source-description">소개와 핵심 장점</label>
              <textarea
                id="source-description"
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="누구의 어떤 문제를 어떻게 해결하는지, 꼭 전달할 사실과 차별점을 적어주세요."
                required={sourceType !== "URL" && !sourceTitle.trim()}
              />

              <label htmlFor="reference-links">참고 링크 (선택, 한 줄에 하나)</label>
              <textarea
                id="reference-links"
                rows={3}
                value={referenceLinks}
                onChange={(event) => setReferenceLinks(event.target.value)}
                placeholder={"https://smartstore.naver.com/...\nhttps://www.instagram.com/..."}
              />

              <button className="source-submit" type="submit" disabled={pending}>
                {pending ? "근거 확인 중…" : "홍보 계획 시작"}
              </button>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <p className="form-note">
                URL 본문·파일은 아직 자동 수집하지 않습니다. 입력값과 참고 링크를 근거로
                초안을 만들고 게시 전 사람이 확인합니다.
              </p>
              <div className="privacy-note">
                <span aria-hidden="true">◎</span>
                현재 단계에서는 페이지 본문을 저장하거나 외부 게시를 실행하지 않습니다.
              </div>
            </form>
          </div>
        )}

        {stage === "brief" && analysis && (
          <div className="brief-layout">
            <div className="analysis-card">
              <div className="analysis-label">
                <span>분석 근거</span>
                <b>NEEDS CONFIRMATION</b>
              </div>
              <div className="card-heading">
                <span className="status-dot" />
                <div>
                  <p className="section-kicker">분석 접수 완료</p>
                  <h2 id="planner-title">{analysis.title}</h2>
                </div>
              </div>
              <dl className="evidence-list">
                {analysis.evidence.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              {analysis.warnings.map((warning) => (
                <p className="warning" key={warning}>
                  {warning}
                </p>
              ))}
            </div>

            <form className="brief-form" onSubmit={handlePlan}>
              <div className="form-heading">
                <p className="section-kicker">정확도를 높이는 4가지</p>
                <h2>지금 가장 중요한 조건을 확인해 주세요.</h2>
              </div>

              <fieldset>
                <legend>1. 가장 중요한 목표</legend>
                <div className="choice-row">
                  {goals.map((item) => (
                    <label className={goal === item.value ? "choice active" : "choice"} key={item.value}>
                      <input
                        type="radio"
                        name="goal"
                        value={item.value}
                        checked={goal === item.value}
                        onChange={() => setGoal(item.value)}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="field-pair">
                <label>
                  <span>2. 핵심 고객</span>
                  <input
                    value={targetAudience}
                    onChange={(event) => setTargetAudience(event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>3. 대상 지역</span>
                  <input
                    value={targetRegion}
                    onChange={(event) => setTargetRegion(event.target.value)}
                    required
                  />
                </label>
              </div>

              <label className="budget-field">
                <span>4. 월 실험 예산</span>
                <strong>{won.format(monthlyBudget)}</strong>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="100000"
                  value={monthlyBudget}
                  onChange={(event) => setMonthlyBudget(Number(event.target.value))}
                />
                <span className="range-labels">
                  <small>0원</small>
                  <small>200만원</small>
                </span>
              </label>

              <fieldset>
                <legend>직접 할 수 있는 제작</legend>
                <div className="choice-row">
                  {capabilityOptions.map((capability) => (
                    <label
                      className={capabilities.includes(capability) ? "choice active" : "choice"}
                      key={capability}
                    >
                      <input
                        type="checkbox"
                        checked={capabilities.includes(capability)}
                        onChange={() => toggleCapability(capability)}
                      />
                      {capability}
                    </label>
                  ))}
                </div>
              </fieldset>

              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
              <button className="primary-button" type="submit" disabled={pending}>
                {pending ? "추천 경로 계산 중…" : "나의 실행지도 만들기"}
              </button>
            </form>
          </div>
        )}

        {stage === "result" && plan && (
          <div className="result-layout">
            <div className="result-heading">
              <div>
                <p className="section-kicker">이번 달 추천 전략</p>
                <h2 id="planner-title">{plan.strategySummary}</h2>
              </div>
              <button className="text-button" type="button" onClick={reset}>
                다른 사이트 분석
              </button>
            </div>

            <section aria-labelledby="channel-title">
              <div className="section-title-row">
                <h3 id="channel-title">채널 우선순위</h3>
                <p>점수보다 이유와 다음 행동을 먼저 확인하세요.</p>
              </div>
              <div className="recommendation-grid">
                {plan.recommendations.map((item, index) => (
                  <article
                    className={`recommendation-card recommendation-tone-${index}`}
                    key={item.channelId}
                  >
                    <div className="recommendation-topline">
                      <span className={`priority priority-${index}`}>{item.priority}</span>
                      <strong className="score-badge">{item.score}</strong>
                    </div>
                    <h4>{item.name}</h4>
                    <span className="funnel-label">{item.funnelStage}</span>
                    <p>{item.reason}</p>
                    {item.warning && <p className="recommendation-warning">{item.warning}</p>}
                    <dl className="recommendation-meta">
                      <div>
                        <dt>예상 비용</dt>
                        <dd>
                          {won.format(item.estimatedCostMin)}–{won.format(item.estimatedCostMax)}
                        </dd>
                      </div>
                      <div>
                        <dt>준비 시간</dt>
                        <dd>약 {item.estimatedHours}시간</dd>
                      </div>
                      <div>
                        <dt>신뢰도</dt>
                        <dd>{item.confidence}</dd>
                      </div>
                    </dl>
                    <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                      근거 보기 · {item.verifiedAt}
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section className="cost-section" aria-labelledby="cost-title">
              <div className="section-title-row">
                <h3 id="cost-title">예산 시나리오</h3>
                <p>광고비만이 아니라 제작과 운영시간까지 포함합니다.</p>
              </div>
              <div className="scenario-grid">
                {plan.costScenarios.map((scenario, index) => (
                  <article
                    className={index === 1 ? "scenario-card is-highlighted" : "scenario-card"}
                    key={scenario.id}
                  >
                    {index === 1 && <span className="scenario-pick">첫 실험 추천</span>}
                    <p>{scenario.description}</p>
                    <h4>{scenario.name}</h4>
                    <strong>{won.format(scenario.totalCost)}</strong>
                    <ul>
                      <li>
                        <span>매체비</span>
                        <b>{won.format(scenario.mediaCost)}</b>
                      </li>
                      <li>
                        <span>제작비</span>
                        <b>{won.format(scenario.productionCost)}</b>
                      </li>
                      <li>
                        <span>운영시간 환산</span>
                        <b>{won.format(scenario.operationCost)}</b>
                      </li>
                      <li>
                        <span>도구·예비비</span>
                        <b>{won.format(scenario.toolCost + scenario.contingency)}</b>
                      </li>
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section aria-labelledby="action-title">
              <div className="section-title-row">
                <h3 id="action-title">이번 주 실행 5단계</h3>
                <p>현재 모두 시작 전입니다. 실제 게시와 성과 측정은 다음 단계에서 연결합니다.</p>
              </div>
              <ol className="action-list">
                {plan.actions.map((action, index) => (
                  <li key={action.id}>
                    <span className="action-number">{String(index + 1).padStart(2, "0")}</span>
                    <div className="action-main">
                      <div className="action-title">
                        <span>{action.channelName} · {action.contentType}</span>
                        <h4>{action.title}</h4>
                      </div>
                      <p>{action.reason}</p>
                      <blockquote>{action.hook}</blockquote>
                      <div className="tag-row">
                        {action.preparation.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                    <div className="action-cost">
                      <span className="action-status">
                        <i aria-hidden="true" />
                        {action.status}
                      </span>
                      <strong>{won.format(action.estimatedCost)}</strong>
                      <small>약 {action.estimatedHours}시간</small>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <aside className="video-next-card">
              <div>
                <span>AI VIDEO STUDIO</span>
                <h3>이 실행계획을 30~40초 홍보 영상으로 바꿔보세요.</h3>
                <p>
                  대본과 7개 장면을 먼저 만들고 사람이 사실·권리를 확인한 뒤에만
                  미리보기 MP4를 렌더합니다. 자동 업로드와 광고 집행은 하지 않습니다.
                </p>
              </div>
              <button type="button" onClick={openVideoStudio}>
                홍보 영상 초안 만들기 ↗
              </button>
            </aside>

            <aside className="pricing-experiment" aria-labelledby="pricing-experiment-title">
              <div>
                <span>EARLY ACCESS · 결제 없음</span>
                <h3 id="pricing-experiment-title">어떤 결과물이라면 비용을 낼 가치가 있나요?</h3>
                <p>
                  결제나 신청은 진행하지 않습니다. 가장 필요한 수준을 선택하면 정식 서비스의
                  기능과 가격을 결정하는 익명 수요 신호로만 사용합니다.
                </p>
              </div>
              <div className="pricing-options">
                <button
                  className={pricingInterest === "draft_9900" ? "is-selected" : ""}
                  type="button"
                  onClick={() => recordPricingInterest("draft_9900")}
                >
                  <strong>₩9,900</strong>
                  <span>대본·장면 초안</span>
                </button>
                <button
                  className={pricingInterest === "video_29900" ? "is-selected" : ""}
                  type="button"
                  onClick={() => recordPricingInterest("video_29900")}
                >
                  <strong>₩29,900</strong>
                  <span>검수 가능한 MP4</span>
                </button>
                <button
                  className={pricingInterest === "monthly_49000" ? "is-selected" : ""}
                  type="button"
                  onClick={() => recordPricingInterest("monthly_49000")}
                >
                  <strong>월 ₩49,000</strong>
                  <span>월 4개 영상</span>
                </button>
              </div>
              {pricingInterest && (
                <p className="pricing-thanks" role="status">
                  선택을 기록했습니다. 실제 결제나 연락처 수집은 발생하지 않습니다.
                </p>
              )}
            </aside>

            <aside className="assumption-box">
              <strong>이 계획의 가정</strong>
              <ul>
                {plan.assumptions.map((assumption) => (
                  <li key={assumption}>{assumption}</li>
                ))}
              </ul>
            </aside>
          </div>
        )}
      </section>

      <section className="how-section" id="how">
        <div className="how-heading">
          <div>
            <p className="section-kicker">HOW IT WORKS</p>
            <h2>정보를 더 모으기보다,<br />다음 행동을 더 선명하게.</h2>
          </div>
          <p>
            채널을 나열하지 않습니다. 근거를 확인하고, 조건을 고친 뒤,
            실제로 끝낼 수 있는 작은 행동으로 바꿉니다.
          </p>
        </div>
        <div className="how-grid">
          <article className="how-card how-lime">
            <span>01</span>
            <h3>사이트를 읽고</h3>
            <p>상품, 고객, 지역, CTA와 기존 홍보 자산을 근거와 함께 정리합니다.</p>
          </article>
          <article className="how-card how-sky">
            <span>02</span>
            <h3>조건을 확인하고</h3>
            <p>목표, 고객, 예산, 직접 만들 수 있는 콘텐츠만 짧게 묻습니다.</p>
          </article>
          <article className="how-card how-coral">
            <span>03</span>
            <h3>실행 순서를 만듭니다</h3>
            <p>채널 목록이 아니라 이번 주 제목, 준비물, 비용, 시간을 제공합니다.</p>
          </article>
        </div>
      </section>

      <footer>
        <div>
          <strong>마케팅맵 <span>↗</span></strong>
          <p>작은 사업의 첫 마케팅 결정을 더 투명하게.</p>
        </div>
        <div className="footer-status">
          <i aria-hidden="true" />
          검토형 파일럿 · 자동 게시 및 광고 집행 없음
        </div>
      </footer>
    </main>
  );
}

function goalCallToAction(goal: string): string {
  if (goal === "상담 문의") return "대표 페이지에서 상담 방법 확인하기";
  if (goal === "방문") return "위치와 방문 정보를 확인하기";
  if (goal === "가입") return "가입 전에 제공 기능 확인하기";
  if (goal === "구매") return "상품 구성과 조건 확인하기";
  return "대표 페이지에서 더 자세히 알아보기";
}

function budgetBand(monthlyBudget: number): string {
  if (monthlyBudget === 0) return "0";
  if (monthlyBudget <= 300_000) return "1-300000";
  if (monthlyBudget <= 1_000_000) return "300001-1000000";
  return "1000001+";
}
