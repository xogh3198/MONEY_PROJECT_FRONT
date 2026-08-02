'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import {
  AiSceneGenerationJob,
  ContentScene,
  ContentScriptDraft,
  PromotionVideoInput,
  UploadedSceneAsset,
  VideoRenderCapabilities,
  VideoRenderJob,
  VideoRenderQuality,
  VideoVoiceStyle,
} from '@/lib/content-studio';
import { trackGrowthEvent } from '@/lib/growth-analytics';
import StudioOperationsPanel from '@/components/StudioOperationsPanel';

const ACCESS_KEY_STORAGE = 'promotion_map_studio_key';
const DRAFT_STORAGE = 'promotion_map_video_draft_v1';
const VIDEO_HANDOFF_STORAGE = 'promotion_map_video_handoff_v1';

const voiceStyles: Array<{
  value: VideoVoiceStyle;
  label: string;
  description: string;
}> = [
  { value: 'NATURAL', label: '담백한 고백', description: '광고가 아닌 실제 경험처럼 전달' },
  { value: 'WHISPER', label: '소심한 속삭임', description: '비밀을 말하듯 시작해 궁금증을 남김' },
  { value: 'SNARKY', label: '건조한 자조', description: '살짝 투덜대고 머쓱하지만 귀에 남는 톤' },
];

const sourceTypes: Array<{ value: PromotionVideoInput['sourceType']; label: string }> = [
  { value: 'URL', label: '웹사이트·링크' },
  { value: 'TEXT', label: '소개글·아이디어' },
  { value: 'PRODUCT', label: '상품·서비스' },
  { value: 'PLACE', label: '매장·장소' },
  { value: 'APP', label: '앱' },
  { value: 'CONTENT', label: '기존 콘텐츠' },
];

const initialInput: PromotionVideoInput = {
  sourceType: 'URL',
  title: '',
  description: '',
  sourceUrl: '',
  referenceLinks: [],
  targetAudience: '',
  goal: '관심을 얻고 상세 페이지 방문',
  callToAction: '대표 페이지에서 자세히 알아보기',
  verifiedFacts: [],
  ownedAssetNotes: '',
  referenceVideoUrl: '',
  stylePrompt: '설명 없이 작은 곤란을 고백하고, 짧게 되물은 뒤 해결책을 늦게 공개하는 캐릭터형 쇼츠',
  referenceAnalysisConsent: false,
};

export default function PromotionVideoStudio() {
  const [accessKey, setAccessKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [input, setInput] = useState(initialInput);
  const [referencesText, setReferencesText] = useState('');
  const [factsText, setFactsText] = useState('');
  const [draft, setDraft] = useState<ContentScriptDraft | null>(null);
  const [approved, setApproved] = useState(false);
  const [job, setJob] = useState<VideoRenderJob | null>(null);
  const [capabilities, setCapabilities] = useState<VideoRenderCapabilities | null>(null);
  const [voiceStyle, setVoiceStyle] = useState<VideoVoiceStyle>('SNARKY');
  const [selectedProvider, setSelectedProvider] = useState<string>('POLLY');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string>('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sceneAssets, setSceneAssets] = useState<Record<number, UploadedSceneAsset>>({});
  const [assetUploading, setAssetUploading] = useState<number | null>(null);
  const [aiSceneJobs, setAiSceneJobs] = useState<Record<number, AiSceneGenerationJob>>({});
  const [aiSceneLoading, setAiSceneLoading] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState('');
  const [handoffLoaded, setHandoffLoaded] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem(ACCESS_KEY_STORAGE) || '';
    const savedDraft = localStorage.getItem(DRAFT_STORAGE);
    if (savedKey) {
      setAccessKey(savedKey);
      setKeyInput(savedKey);
    }
    if (savedDraft) {
      try {
        setDraft(JSON.parse(savedDraft) as ContentScriptDraft);
      } catch {
        localStorage.removeItem(DRAFT_STORAGE);
      }
    }
    const handoff = sessionStorage.getItem(VIDEO_HANDOFF_STORAGE);
    if (handoff) {
      try {
        const parsed = JSON.parse(handoff) as { input?: PromotionVideoInput };
        if (parsed.input?.title && parsed.input.description) {
          setInput({ ...initialInput, ...parsed.input });
          setReferencesText(parsed.input.referenceLinks.join('\n'));
          setFactsText(parsed.input.verifiedFacts.join('\n'));
          setDraft(null);
          localStorage.removeItem(DRAFT_STORAGE);
          setHandoffLoaded(true);
        }
      } catch {
        // 손상된 임시 전달값은 사용하지 않습니다.
      } finally {
        sessionStorage.removeItem(VIDEO_HANDOFF_STORAGE);
      }
    }
  }, []);

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
  }, [videoUrl]);

  useEffect(() => {
    if (!accessKey) return;
    let cancelled = false;
    fetch('/api/content-studio/capabilities', {
      cache: 'no-store',
      headers: { 'x-content-studio-key': accessKey },
    })
      .then(async response => {
        if (!response.ok) throw new Error('영상 기능 상태 조회 실패');
        return response.json() as Promise<VideoRenderCapabilities>;
      })
      .then(data => {
        if (!cancelled) {
          setCapabilities(data);
          if (data.voiceCatalog?.length) {
            const defaultProvider = data.voiceCatalog.find(p => p.id === 'ELEVENLABS' && p.configured)
              || data.voiceCatalog.find(p => p.configured)
              || data.voiceCatalog[0];
            setSelectedProvider(defaultProvider.id);
            setVoiceStyle(
              ['ELEVENLABS', 'TYPECAST'].includes(defaultProvider.id) ? 'SNARKY' : 'NATURAL',
            );
            if (defaultProvider.voices.length) {
              setSelectedVoiceId(defaultProvider.voices[0].id);
            }
          }
        }
      })
      .catch(() => {
        if (!cancelled) setCapabilities(null);
      });
    return () => { cancelled = true; };
  }, [accessKey]);

  const authenticate = (event: FormEvent) => {
    event.preventDefault();
    const key = keyInput.trim();
    if (!key) return;
    localStorage.setItem(ACCESS_KEY_STORAGE, key);
    setAccessKey(key);
  };

  const previewVoice = async (provider: string, voiceId: string) => {
    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl);
      setPreviewAudioUrl('');
    }
    setPreviewLoading(true);
    try {
      const response = await fetch('/api/content-studio/voice-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-content-studio-key': accessKey,
        },
        body: JSON.stringify({ provider, voiceId, text: voicePreviewCopy(voiceStyle), voiceStyle }),
      });
      if (!response.ok) throw new Error('미리듣기 실패');
      setPreviewAudioUrl(URL.createObjectURL(await response.blob()));
    } catch {
      setError('음성 미리듣기에 실패했습니다.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const updateInput = <K extends keyof PromotionVideoInput>(key: K, value: PromotionVideoInput[K]) => {
    setInput(current => ({ ...current, [key]: value }));
  };

  const createDraft = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setApproved(false);
    setJob(null);
    setVideoUrl('');
    Object.values(sceneAssets).forEach(asset => {
      if (asset.previewUrl) URL.revokeObjectURL(asset.previewUrl);
    });
    setSceneAssets({});
    setAiSceneJobs({});

    try {
      const payload: PromotionVideoInput = {
        ...input,
        referenceLinks: lines(referencesText),
        verifiedFacts: lines(factsText),
      };
      const response = await fetch('/api/content-studio/promotion-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-content-studio-key': accessKey,
        },
        body: JSON.stringify({ input: payload, voiceStyle }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '영상 초안을 만들지 못했습니다.');
      setDraft(data.draft);
      localStorage.setItem(DRAFT_STORAGE, JSON.stringify(data.draft));
      trackGrowthEvent('promotion_video_draft_created', {
        source_type: input.sourceType,
        scene_count: data.draft?.scenes?.length || 0,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '영상 초안을 만들지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const generateAiScene = async (scene: ContentScene) => {
    if (!draft || !capabilities?.higgsfieldConfigured) return;
    const activeGeneratedCount = Object.values(aiSceneJobs)
      .filter(item => item.status !== 'FAILED').length;
    if (!aiSceneJobs[scene.order] && activeGeneratedCount >= 2) {
      setError('비용과 과도한 AI 느낌을 줄이기 위해 한 영상에서 AI 장면은 최대 2개만 만들 수 있습니다. 나머지는 실제 사진·영상 또는 스톡을 사용해 주세요.');
      return;
    }

    setAiSceneLoading(scene.order);
    setError('');
    try {
      const submitResponse = await fetch('/api/content-studio/ai-assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-content-studio-key': accessKey,
        },
        body: JSON.stringify({
          experimentId: draft.experimentId,
          scene,
          stylePrompt: draft.stylePrompt || input.stylePrompt,
        }),
      });
      const submitted = await submitResponse.json() as AiSceneGenerationJob & { error?: string };
      if (!submitResponse.ok) throw new Error(submitted.error || 'AI 장면 생성을 시작하지 못했습니다.');

      let current = submitted;
      setAiSceneJobs(items => ({ ...items, [scene.order]: current }));
      const deadline = Date.now() + 15 * 60 * 1_000;
      while (current.status === 'QUEUED' || current.status === 'GENERATING') {
        if (Date.now() > deadline) throw new Error('AI 장면 생성이 15분 안에 끝나지 않았습니다.');
        await new Promise(resolve => window.setTimeout(resolve, 3_000));
        const statusResponse = await fetch(`/api/content-studio/ai-assets/${current.id}`, {
          cache: 'no-store',
          headers: { 'x-content-studio-key': accessKey },
        });
        const statusData = await statusResponse.json() as AiSceneGenerationJob & { error?: string };
        if (!statusResponse.ok) throw new Error(statusData.error || 'AI 장면 상태를 확인하지 못했습니다.');
        current = statusData;
        setAiSceneJobs(items => ({ ...items, [scene.order]: current }));
      }
      if (current.status === 'FAILED' || !current.assetRef) {
        throw new Error(current.errorMessage || 'AI 장면 생성에 실패했습니다.');
      }

      const fileResponse = await fetch(`/api/content-studio/ai-assets/${current.id}/file`, {
        cache: 'no-store',
        headers: { 'x-content-studio-key': accessKey },
      });
      if (!fileResponse.ok) throw new Error('완료된 AI 장면을 불러오지 못했습니다.');
      const previewUrl = URL.createObjectURL(await fileResponse.blob());
      setSceneAssets(items => {
        const previous = items[scene.order];
        if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
        return {
          ...items,
          [scene.order]: {
            assetRef: current.assetRef!,
            mediaKind: 'VIDEO',
            contentType: current.contentType || 'video/mp4',
            fileName: current.fileName || `AI 장면 ${scene.order}`,
            previewUrl,
          },
        };
      });
      trackGrowthEvent('promotion_ai_scene_completed', {
        experiment_id: draft.experimentId,
        scene_order: scene.order,
        provider: current.provider,
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'AI 장면 생성에 실패했습니다.');
    } finally {
      setAiSceneLoading(null);
    }
  };

  const renderVideo = async (quality: VideoRenderQuality) => {
    if (!draft || !approved) return;
    setVideoLoading(true);
    setError('');
    setJob(null);
    setVideoUrl('');
    trackGrowthEvent('promotion_video_render_requested', {
      quality,
      experiment_id: draft.experimentId,
    });

    try {
      const submitResponse = await fetch('/api/content-studio/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-content-studio-key': accessKey,
        },
        body: JSON.stringify({
          draft,
          quality,
          voiceStyle,
          voiceProvider: selectedProvider,
          voiceId: selectedVoiceId,
          sceneAssets: Object.fromEntries(
            Object.entries(sceneAssets).map(([order, asset]) => [order, asset.assetRef]),
          ),
        }),
      });
      const submitted = await submitResponse.json();
      if (!submitResponse.ok) throw new Error(submitted.error || '영상 렌더를 시작하지 못했습니다.');

      let current = submitted as VideoRenderJob;
      setJob(current);
      const deadline = Date.now() + 20 * 60 * 1_000;

      while (current.status === 'QUEUED' || current.status === 'RENDERING') {
        if (Date.now() > deadline) throw new Error('영상 렌더가 20분 안에 끝나지 않았습니다.');
        await new Promise(resolve => window.setTimeout(resolve, 3_000));
        const statusResponse = await fetch(`/api/content-studio/video/${current.id}`, {
          cache: 'no-store',
          headers: { 'x-content-studio-key': accessKey },
        });
        const statusData = await statusResponse.json();
        if (!statusResponse.ok) throw new Error(statusData.error || '영상 상태를 확인하지 못했습니다.');
        current = statusData as VideoRenderJob;
        setJob(current);
      }

      if (current.status === 'FAILED') throw new Error(current.errorMessage || '영상 렌더에 실패했습니다.');
      const fileResponse = await fetch(`/api/content-studio/video/${current.id}/file`, {
        cache: 'no-store',
        headers: { 'x-content-studio-key': accessKey },
      });
      if (!fileResponse.ok) {
        const detail = await fileResponse.json().catch(() => ({}));
        throw new Error(detail.error || '영상 파일을 불러오지 못했습니다.');
      }
      setVideoUrl(URL.createObjectURL(await fileResponse.blob()));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '영상 렌더에 실패했습니다.');
    } finally {
      setVideoLoading(false);
    }
  };

  const uploadSceneAsset = async (sceneOrder: number, file: File) => {
    if (file.size > 4 * 1024 * 1024) {
      setError('장면 파일은 4MB 이하여야 합니다. 긴 영상은 장면별 5~6초로 잘라 압축해 주세요.');
      return;
    }
    setAssetUploading(sceneOrder);
    setError('');
    try {
      const formData = new FormData();
      formData.set('file', file, file.name);
      const response = await fetch('/api/content-studio/assets', {
        method: 'POST',
        headers: { 'x-content-studio-key': accessKey },
        body: formData,
      });
      const data = await response.json() as UploadedSceneAsset & { error?: string };
      if (!response.ok) throw new Error(data.error || '장면 파일을 업로드하지 못했습니다.');
      setSceneAssets(current => {
        const previous = current[sceneOrder];
        if (previous?.previewUrl) URL.revokeObjectURL(previous.previewUrl);
        return {
          ...current,
          [sceneOrder]: {
            ...data,
            previewUrl: URL.createObjectURL(file),
          },
        };
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '장면 파일을 업로드하지 못했습니다.');
    } finally {
      setAssetUploading(null);
    }
  };

  return (
    <main className="promotion-root studio-page">
      <header className="topbar">
        <Link className="brand" href="/promotion-map">
          <span className="brand-mark">P</span>
          <span className="brand-copy"><strong>마케팅맵</strong><small>MARKETING MAP</small></span>
        </Link>
        <nav className="product-nav" aria-label="제품 메뉴">
          <Link href="/">홈</Link>
          <Link href="/forum?utm_source=marketing-map-studio-nav&utm_medium=internal&utm_campaign=product-navigation">
            InvestingBoard
          </Link>
          <Link href="/promotion-map?utm_source=marketing-map-studio-nav&utm_medium=internal&utm_campaign=product-navigation">
            마케팅맵
          </Link>
        </nav>
        <span className="pilot-badge"><i /> HUMAN REVIEW</span>
      </header>

      <section className="studio-hero">
        <p className="section-kicker">MARKETING MAP · VIDEO STUDIO</p>
        <h1>홍보할 내용을 넣으면,<br /><em>말하고 보여줄 순서</em>를 만듭니다.</h1>
        <p>
          마케팅맵에서 정리한 홍보 대상과 목표를 30~45초 대본·큰 자막·7개 장면으로 바꿉니다.
          소개글, 상품, 매장, 앱, 기존 콘텐츠와 사용권이 있는 사진으로도 시작할 수 있습니다.
        </p>
        <div className="studio-flow" aria-label="영상 제작 흐름">
          <span><b>01</b> 근거 입력</span><i>→</i>
          <span><b>02</b> AI 초안</span><i>→</i>
          <span><b>03</b> 사람 검수</span><i>→</i>
          <span><b>04</b> MP4 미리보기</span>
        </div>
      </section>

      {!accessKey ? (
        <section className="studio-login">
          <div>
            <p className="section-kicker">PRIVATE PILOT</p>
            <h2>내부 검수 키로 스튜디오를 엽니다.</h2>
            <p>대본과 렌더 기능은 비용과 오남용을 막기 위해 공개하지 않습니다.</p>
          </div>
          <form onSubmit={authenticate}>
            <input
              type="password"
              value={keyInput}
              onChange={event => setKeyInput(event.target.value)}
              placeholder="CONTENT_STUDIO_ACCESS_KEY"
              autoComplete="current-password"
            />
            <button type="submit">스튜디오 열기</button>
          </form>
        </section>
      ) : (
        <>
        <StudioOperationsPanel accessKey={accessKey} />
        <section className="studio-workspace">
          <form className="studio-input-card" onSubmit={createDraft}>
            <div className="studio-card-heading">
              <span>01</span>
              <div><p className="section-kicker">SOURCE BRIEF</p><h2>확인된 내용만 넣어주세요.</h2></div>
            </div>

            {handoffLoaded && (
              <p className="studio-handoff-note">
                실행지도에서 대상·고객·목표·CTA를 가져왔습니다. 확인된 사실과 사용권이 있는 자산만 보완해 주세요.
              </p>
            )}

            <fieldset>
              <legend>홍보 대상</legend>
              <div className="studio-type-grid">
                {sourceTypes.map(item => (
                  <label className={input.sourceType === item.value ? 'active' : ''} key={item.value}>
                    <input
                      type="radio"
                      value={item.value}
                      checked={input.sourceType === item.value}
                      onChange={() => updateInput('sourceType', item.value)}
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <label>이름<input required maxLength={160} value={input.title} onChange={event => updateInput('title', event.target.value)} placeholder="예: 동네 로스터리의 원두 정기구독" /></label>
            <label>대표 URL (선택)<input type="url" value={input.sourceUrl || ''} onChange={event => updateInput('sourceUrl', event.target.value)} placeholder="https://example.com" /></label>
            <label>누구의 어떤 문제를 어떻게 해결하나요?
              <textarea required rows={6} value={input.description} onChange={event => updateInput('description', event.target.value)} placeholder="기능 목록보다 고객 상황, 해결 방식, 차별점을 구체적으로 적어주세요." />
            </label>
            <div className="studio-field-pair">
              <label>핵심 고객<input required value={input.targetAudience} onChange={event => updateInput('targetAudience', event.target.value)} placeholder="예: 원두 선택이 어려운 1인 가구" /></label>
              <label>영상 목표<input required value={input.goal} onChange={event => updateInput('goal', event.target.value)} /></label>
            </div>
            <label>마지막 행동 요청<input required value={input.callToAction} onChange={event => updateInput('callToAction', event.target.value)} placeholder="예: 샘플 구성 확인하기" /></label>
            <label>확인 가능한 사실 (선택, 한 줄에 하나)
              <textarea rows={4} value={factsText} onChange={event => setFactsText(event.target.value)} placeholder={"예: 서울 성수동에서 직접 로스팅\n예: 주문 후 로스팅 날짜 표기"} />
            </label>
            <label>참고 링크 (선택, 한 줄에 하나)
              <textarea rows={3} value={referencesText} onChange={event => setReferencesText(event.target.value)} placeholder={"공식 상세 페이지, 플레이스, 앱스토어 등 최대 5개"} />
            </label>
            <div className="studio-reference-panel">
              <div>
                <p className="section-kicker">REFERENCE VIDEO</p>
                <h3>유튜브는 내용이 아니라 편집 구조만 참고합니다.</h3>
                <p>훅 시점·자막 전환·말의 밀도만 분석하고 원문 문장, 영상, 음성은 가져오지 않습니다.</p>
              </div>
              <label>참고 YouTube URL (선택)
                <input
                  type="url"
                  value={input.referenceVideoUrl || ''}
                  onChange={event => updateInput('referenceVideoUrl', event.target.value)}
                  placeholder="https://www.youtube.com/shorts/..."
                />
              </label>
              <label>원하는 영상 느낌
                <textarea
                  rows={3}
                  maxLength={800}
                  value={input.stylePrompt || ''}
                  onChange={event => updateInput('stylePrompt', event.target.value)}
                  placeholder="예: 첫 2초에 질문, 빠른 자막, 실제 사용 화면 중심, 차분하지만 귀에 꽂히는 말투"
                />
              </label>
              <label className="studio-reference-consent">
                <input
                  type="checkbox"
                  checked={Boolean(input.referenceAnalysisConsent)}
                  disabled={!input.referenceVideoUrl}
                  onChange={event => updateInput('referenceAnalysisConsent', event.target.checked)}
                />
                <span>
                  분석 권한이 있는 공개 영상이며, Apify 분석 비용이 발생할 수 있음을 확인했습니다.
                  {!capabilities?.apifyReferenceConfigured && ' 현재는 Apify가 연결되지 않아 스타일 문구만 사용합니다.'}
                </span>
              </label>
            </div>
            <label>사용권이 있는 사진·화면
              <textarea rows={3} value={input.ownedAssetNotes} onChange={event => updateInput('ownedAssetNotes', event.target.value)} placeholder="예: 제품 정면 사진 3장, 포장 영상 1개, 앱 화면 캡처 4장" />
            </label>

            <button className="studio-generate" disabled={loading} type="submit">
              {loading ? '대본과 장면을 만드는 중…' : '홍보 영상 초안 만들기 ↗'}
            </button>
            <p className="studio-small-note">외부 페이지 본문이나 이미지를 임의로 복사하지 않습니다. 자동 게시·광고 집행도 하지 않습니다.</p>
          </form>

          <section className="studio-draft-card">
            <div className="studio-card-heading">
              <span>02</span>
              <div><p className="section-kicker">SCRIPT & SCENES</p><h2>검수할 영상 설계</h2></div>
            </div>
            {error && <p className="studio-error" role="alert">{error}</p>}
            {!draft && !loading && <div className="studio-empty">왼쪽 정보를 입력하면 대본, 자막, 장면 구성이 여기에 표시됩니다.</div>}
            {loading && <div className="studio-empty">사람이 읽었을 때 어색하지 않은 흐름으로 정리하고 있습니다…</div>}
            {draft && !loading && (
              <DraftResult
                draft={draft}
                approved={approved}
                job={job}
                videoUrl={videoUrl}
                videoLoading={videoLoading}
                capabilities={capabilities}
                voiceStyle={voiceStyle}
                selectedProvider={selectedProvider}
                selectedVoiceId={selectedVoiceId}
                previewAudioUrl={previewAudioUrl}
                previewLoading={previewLoading}
                sceneAssets={sceneAssets}
                assetUploading={assetUploading}
                aiSceneJobs={aiSceneJobs}
                aiSceneLoading={aiSceneLoading}
                onApprove={setApproved}
                onVoiceStyle={setVoiceStyle}
                onSelectProvider={setSelectedProvider}
                onSelectVoice={setSelectedVoiceId}
                onPreviewVoice={previewVoice}
                onUploadAsset={uploadSceneAsset}
                onGenerateAiScene={generateAiScene}
                onRender={renderVideo}
              />
            )}
          </section>
        </section>
        </>
      )}
    </main>
  );
}

function DraftResult({
  draft,
  approved,
  job,
  videoUrl,
  videoLoading,
  capabilities,
  voiceStyle,
  selectedProvider,
  selectedVoiceId,
  previewAudioUrl,
  previewLoading,
  sceneAssets,
  assetUploading,
  aiSceneJobs,
  aiSceneLoading,
  onApprove,
  onVoiceStyle,
  onSelectProvider,
  onSelectVoice,
  onPreviewVoice,
  onUploadAsset,
  onGenerateAiScene,
  onRender,
}: {
  draft: ContentScriptDraft;
  approved: boolean;
  job: VideoRenderJob | null;
  videoUrl: string;
  videoLoading: boolean;
  capabilities: VideoRenderCapabilities | null;
  voiceStyle: VideoVoiceStyle;
  selectedProvider: string;
  selectedVoiceId: string;
  previewAudioUrl: string;
  previewLoading: boolean;
  sceneAssets: Record<number, UploadedSceneAsset>;
  assetUploading: number | null;
  aiSceneJobs: Record<number, AiSceneGenerationJob>;
  aiSceneLoading: number | null;
  onApprove: (approved: boolean) => void;
  onVoiceStyle: (style: VideoVoiceStyle) => void;
  onSelectProvider: (provider: string) => void;
  onSelectVoice: (voiceId: string) => void;
  onPreviewVoice: (provider: string, voiceId: string) => void;
  onUploadAsset: (sceneOrder: number, file: File) => void;
  onGenerateAiScene: (scene: ContentScene) => void;
  onRender: (quality: VideoRenderQuality) => void;
}) {
  return (
    <div className="studio-result">
      <div className="studio-hook">
        <small>{draft.durationSeconds}초 · {draft.targetAudience}</small>
        <h3>{draft.title}</h3>
        <p>{draft.hook}</p>
      </div>
      {draft.referenceAnalysis && (
        <div className={`studio-reference-result ${draft.referenceAnalysis.status.toLowerCase()}`}>
          <strong>
            참고 영상 구조 {draft.referenceAnalysis.status === 'ANALYZED' ? '분석 완료' : '대체 처리'}
          </strong>
          <p>{draft.referenceAnalysis.styleSummary}</p>
          <small>{draft.referenceAnalysis.note}</small>
        </div>
      )}
      <div className="studio-scenes">
        {draft.scenes.map(scene => (
          <article key={`${scene.order}-${scene.onScreenText}`}>
            <span>SCENE {String(scene.order).padStart(2, '0')} · {scene.seconds}s</span>
            <h4>{scene.onScreenText}</h4>
            <p>{scene.narration}</p>
            <small>화면: {scene.visualDirection}</small>
            <div className="studio-scene-asset">
              {sceneAssets[scene.order]?.previewUrl && sceneAssets[scene.order].mediaKind === 'IMAGE' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sceneAssets[scene.order].previewUrl} alt={`장면 ${scene.order} 업로드 미리보기`} />
              )}
              {sceneAssets[scene.order]?.previewUrl && sceneAssets[scene.order].mediaKind === 'VIDEO' && (
                <video muted playsInline src={sceneAssets[scene.order].previewUrl} />
              )}
              <label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
                  disabled={assetUploading !== null}
                  onChange={event => {
                    const file = event.target.files?.[0];
                    if (file) onUploadAsset(scene.order, file);
                    event.target.value = '';
                  }}
                />
                {assetUploading === scene.order
                  ? '업로드 중…'
                  : sceneAssets[scene.order]
                    ? `${sceneAssets[scene.order].fileName} 교체`
                    : '내 사진·영상 넣기'}
              </label>
              <button
                type="button"
                className="studio-ai-scene-button"
                disabled={
                  !capabilities?.higgsfieldConfigured
                  || aiSceneLoading !== null
                  || aiSceneJobs[scene.order]?.status === 'COMPLETED'
                }
                onClick={() => onGenerateAiScene(scene)}
              >
                {!capabilities?.higgsfieldConfigured
                  ? 'Higgsfield 연결 필요'
                  : aiSceneLoading === scene.order
                    ? 'AI 장면 생성 중…'
                    : aiSceneJobs[scene.order]?.status === 'COMPLETED'
                      ? 'AI 장면 적용됨'
                      : 'AI 영상 장면 만들기'}
              </button>
            </div>
            {aiSceneJobs[scene.order] && aiSceneJobs[scene.order].status !== 'COMPLETED' && (
              <p className={`studio-ai-scene-status ${aiSceneJobs[scene.order].status.toLowerCase()}`}>
                {aiSceneJobs[scene.order].stage} · {aiSceneJobs[scene.order].progress}%
                {aiSceneJobs[scene.order].errorMessage && ` · ${aiSceneJobs[scene.order].errorMessage}`}
              </p>
            )}
          </article>
        ))}
      </div>
      <div className="studio-voice-style">
        <div>
          <h3>🎙 음성 설정</h3>
          <p>
            현재 공급자: <b>{capabilities?.selectedVoiceProvider || '확인 중'}</b>
            {!capabilities?.pixabayConfigured && ' · 스톡 이미지 키 미설정'}
          </p>
        </div>

        {/* Provider Selection */}
        {capabilities?.voiceCatalog && capabilities.voiceCatalog.length > 0 && (
          <div className="studio-voice-providers">
            <h4>음성 제공자</h4>
            <div className="studio-provider-grid">
              {capabilities.voiceCatalog.map(provider => (
                <label
                  className={`studio-provider-option ${selectedProvider === provider.id ? 'active' : ''} ${!provider.configured ? 'disabled' : ''}`}
                  key={provider.id}
                >
                  <input
                    type="radio"
                    name="voice-provider"
                    value={provider.id}
                    checked={selectedProvider === provider.id}
                    disabled={!provider.configured}
                    onChange={() => {
                      onSelectProvider(provider.id);
                      if (provider.voices.length) onSelectVoice(provider.voices[0].id);
                    }}
                  />
                  <span className="provider-name">{provider.name}</span>
                  <span className={`provider-tier ${provider.tier.toLowerCase()}`}>
                    {provider.tier === 'FREE' ? '무료' : '프리미엄'}
                  </span>
                  {!provider.configured && <small className="provider-unconfigured">API 키 필요</small>}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Voice Selection */}
        {capabilities?.voiceCatalog && (() => {
          const currentProvider = capabilities.voiceCatalog.find(p => p.id === selectedProvider);
          if (!currentProvider || !currentProvider.voices.length) return null;
          return (
            <div className="studio-voice-list">
              <h4>🗣 음성 선택</h4>
              <div className="studio-voice-grid">
                {currentProvider.voices.map(voice => (
                  <label
                    className={`studio-voice-option ${selectedVoiceId === voice.id ? 'active' : ''}`}
                    key={voice.id}
                  >
                    <input
                      type="radio"
                      name="voice-id"
                      value={voice.id}
                      checked={selectedVoiceId === voice.id}
                      onChange={() => onSelectVoice(voice.id)}
                    />
                    <div className="voice-info">
                      <strong>{voice.name}</strong>
                      <small>{voice.description}</small>
                      <span className="voice-gender">{voice.gender === 'FEMALE' ? '👩' : voice.gender === 'MALE' ? '👨' : '🎭'}</span>
                    </div>
                    <button
                      type="button"
                      className="voice-preview-btn"
                      disabled={previewLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        onPreviewVoice(currentProvider.id, voice.id);
                      }}
                    >
                      {previewLoading ? '⏳' : '▶'}
                    </button>
                  </label>
                ))}
              </div>
              {previewAudioUrl && (
                <audio controls autoPlay src={previewAudioUrl} className="voice-preview-audio" />
              )}
            </div>
          );
        })()}

        {/* Voice Style */}
        <div className="studio-voice-options">
          <h4>🎭 음성 스타일</h4>
          {voiceStyles.map(option => {
            const supported = option.value === 'NATURAL'
              || capabilities?.supportedVoiceStyles?.includes(option.value);
            return (
              <label className={voiceStyle === option.value ? 'active' : ''} key={option.value}>
                <input
                  type="radio"
                  name="voice-style"
                  value={option.value}
                  checked={voiceStyle === option.value}
                  disabled={!supported}
                  onChange={() => onVoiceStyle(option.value)}
                />
                <strong>{option.label}</strong>
                <small>{supported ? option.description : 'ElevenLabs·Typecast 설정 후 사용 가능'}</small>
              </label>
            );
          })}
        </div>
      </div>
      <div className="studio-review">
        <h3>게시 전 확인</h3>
        <ul>{draft.factChecks.map(item => <li key={item}>{item}</li>)}</ul>
        <p><b>출처</b> {draft.sourceCredits.join(' · ')}</p>
        <p><b>고지</b> {draft.disclaimer} {draft.aiDisclosure}</p>
        <label>
          <input type="checkbox" checked={approved} onChange={event => onApprove(event.target.checked)} />
          사실, 표현, 이미지·영상 사용권을 확인했고 미리보기 렌더를 승인합니다.
        </label>
      </div>
      <div className="studio-render">
        <button type="button" disabled={!approved || videoLoading} onClick={() => onRender('PREVIEW')}>
          {videoLoading ? '음성·자막 MP4 렌더 중…' : '저해상도 미리보기 만들기'}
        </button>
        <button type="button" disabled={!approved || videoLoading} onClick={() => onRender('FINAL')}>최종본 렌더</button>
        {job && <p>{job.stage} · {job.progress}% · {job.status}</p>}
        {videoUrl && <video controls playsInline src={videoUrl} />}
      </div>
    </div>
  );
}

function lines(value: string): string[] {
  return value.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
}

function voicePreviewCopy(style: VideoVoiceStyle): string {
  if (style === 'WHISPER') {
    return '저기요... 이걸 아직도 직접 하고 계셨어요? 사실 더 쉬운 방법이 있거든요.';
  }
  if (style === 'SNARKY') {
    return '여러분... 저 좀 곤란해졌어요. 왜 그러냐고요? 이렇게까지 만들었는데 아무도 모르시더라고요.';
  }
  return '제가 괜한 걸 만들었나 봐요. 그래도 한 번만 보실래요? 생각보다 편하거든요.';
}
