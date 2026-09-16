'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type Video = { id: string; url: string; title: string; channel: string; thumbnail: string; publishedAt: string; viewCount: number; durationSeconds: number; language: string; license: string };
type Caption = { startSeconds: number; endSeconds: number; text: string };
type Job = { id: string; status: string; stage: string; progress: number; errorMessage?: string };

const STORAGE_KEY = 'promotion_map_studio_key';
const CHUNK_BYTES = 3 * 1024 * 1024;

export default function ShortformClipStudio() {
  const [key, setKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('ko');
  const [reusable, setReusable] = useState(false);
  const [strictAudio, setStrictAudio] = useState(true);
  const [minMinutes, setMinMinutes] = useState(4);
  const [days, setDays] = useState(30);
  const [results, setResults] = useState<Video[]>([]);
  const [selected, setSelected] = useState<Video | null>(null);
  const [searchedAt, setSearchedAt] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sourceId, setSourceId] = useState('');
  const [duration, setDuration] = useState(0);
  const [uploadedPercent, setUploadedPercent] = useState(0);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(30);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [rightsConfirmed, setRightsConfirmed] = useState(false);
  const [quality, setQuality] = useState<'PREVIEW' | 'FINAL'>('PREVIEW');
  const [job, setJob] = useState<Job | null>(null);
  const [outputUrl, setOutputUrl] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) || '';
    setKey(saved);
    setKeyInput(saved);
  }, []);

  useEffect(() => {
    if (!job?.id || ['COMPLETED', 'FAILED'].includes(job.status)) return;
    const timer = window.setInterval(async () => {
      try {
        const response = await fetch(`/api/content-studio/video/${job.id}`, { headers: { 'x-content-studio-key': key } });
        const data = await response.json() as Job;
        if (response.ok) setJob(data);
      } catch { /* next poll retries */ }
    }, 2500);
    return () => window.clearInterval(timer);
  }, [job?.id, job?.status, key]);

  async function api(path: string, init: RequestInit = {}) {
    const response = await fetch(path, { ...init, headers: { 'x-content-studio-key': key, ...init.headers } });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `요청 실패 (${response.status})`);
    return data;
  }

  async function search(event: FormEvent) {
    event.preventDefault();
    setBusy('search'); setError('');
    try {
      const params = new URLSearchParams({ q: query, language, strictAudio: String(strictAudio), reusable: String(reusable), minMinutes: String(minMinutes), days: String(days) });
      const data = await api(`/api/content-studio/discovery?${params}`);
      setResults(data.items || []); setSearchedAt(data.checkedAt || '');
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(''); }
  }

  async function upload() {
    if (!file) return;
    setBusy('upload'); setError(''); setSourceId(''); setUploadedPercent(0);
    try {
      if (file.size > 200 * 1024 * 1024) throw new Error('원본 영상은 200MB 이하여야 합니다.');
      const contentType = file.type || (file.name.toLowerCase().endsWith('.mov') ? 'video/quicktime' : '');
      const started = await api('/api/content-studio/shortform/sources', { method: 'POST', body: JSON.stringify({ size: file.size, contentType }) });
      for (let offset = 0; offset < file.size; offset += CHUNK_BYTES) {
        const chunk = file.slice(offset, offset + CHUNK_BYTES);
        await api(`/api/content-studio/shortform/sources/${started.sourceId}/chunks`, {
          method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'X-Upload-Offset': String(offset) }, body: chunk,
        });
        setUploadedPercent(Math.round(Math.min(1, (offset + chunk.size) / file.size) * 100));
      }
      const completed = await api(`/api/content-studio/shortform/sources/${started.sourceId}/complete`, { method: 'POST', body: '{}' });
      setSourceId(completed.sourceId); setDuration(completed.durationSeconds);
      setEnd(Math.min(30, Math.floor(completed.durationSeconds)));
      setTitle(file.name.replace(/\.[^.]+$/, '').slice(0, 240));
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(''); }
  }

  async function render() {
    setBusy('render'); setError(''); setOutputUrl('');
    try {
      const data = await api('/api/content-studio/shortform/render', {
        method: 'POST', body: JSON.stringify({ sourceId, title, startSeconds: start, endSeconds: end, quality, captions, rightsConfirmed }),
      });
      setJob(data);
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(''); }
  }

  async function loadOutput() {
    if (!job?.id) return;
    setBusy('file'); setError('');
    try {
      const response = await fetch(`/api/content-studio/video/${job.id}/file`, { headers: { 'x-content-studio-key': key } });
      if (!response.ok) throw new Error(`완료된 영상 파일을 불러오지 못했습니다 (${response.status}).`);
      const url = URL.createObjectURL(await response.blob());
      if (outputUrl) URL.revokeObjectURL(outputUrl);
      setOutputUrl(url);
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(''); }
  }

  const field = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900';
  const button = 'rounded-xl bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-50';
  return <main className="min-h-screen bg-[#f5f5ef] px-4 py-10 text-slate-900 md:px-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link href="/promotion-map/studio" className="text-sm font-bold underline">← 홍보 영상 스튜디오</Link>
        <span className="rounded-full border border-slate-400 px-3 py-1 text-xs font-bold">FREE API · ORIGINAL MEDIA</span>
      </div>
      <p className="mb-3 text-xs font-black tracking-[.2em] text-emerald-700">MARKETING MAP / SHORTFORM LAB</p>
      <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl">인기 흐름을 찾고,<br /><span className="text-emerald-700">내 영상으로 쇼츠를 만드세요.</span></h1>
      <p className="mb-8 max-w-3xl text-slate-600">YouTube 공식 API로 인기 영상의 공개 메타데이터를 탐색합니다. 다른 사람의 영상을 내려받지 않습니다. 실제 편집에는 직접 제작했거나 사용 허락을 받은 원본 영상을 업로드하세요.</p>
      {!key ? <section className="mb-8 rounded-3xl border border-slate-300 bg-white p-6">
        <h2 className="mb-3 text-xl font-black">내부 검수 키 입력</h2>
        <form onSubmit={event => { event.preventDefault(); const value = keyInput.trim(); localStorage.setItem(STORAGE_KEY, value); setKey(value); }} className="flex gap-3">
          <input type="password" className={field} value={keyInput} onChange={event => setKeyInput(event.target.value)} placeholder="스튜디오 검수 키" />
          <button className={button} disabled={!keyInput.trim()}>열기</button>
        </form>
      </section> : <>
        {error && <p role="alert" className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 font-semibold text-red-700">{error}</p>}
        <section className="mb-6 rounded-3xl border border-slate-300 bg-white p-6 shadow-[5px_5px_0_#17352d]">
          <div className="mb-5 flex items-center gap-3"><b className="rounded-full bg-lime-200 px-3 py-2">01</b><h2 className="text-2xl font-black">인기 영상 탐색</h2></div>
          <form onSubmit={search} className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <input className={field} value={query} onChange={event => setQuery(event.target.value)} placeholder="주제 검색 (예: 수산물 주문)" required minLength={2} maxLength={80} />
            <select className={field} value={language} onChange={event => setLanguage(event.target.value)}><option value="ko">한국어 관련</option><option value="ja">일본어 관련</option><option value="all">언어 전체</option></select>
            <select className={field} value={minMinutes} onChange={event => setMinMinutes(Number(event.target.value))}><option value={0}>길이 전체</option><option value={4}>4분 이상</option><option value={20}>20분 이상</option></select>
            <select className={field} value={days} onChange={event => setDays(Number(event.target.value))}><option value={7}>최근 7일</option><option value={30}>최근 30일</option><option value={90}>최근 90일</option><option value={365}>최근 1년</option></select>
            <button className={button} disabled={busy === 'search'}>{busy === 'search' ? '검색 중' : '검색'}</button>
          </form>
          <div className="mt-4 flex flex-wrap gap-4"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={strictAudio} onChange={event => setStrictAudio(event.target.checked)} /> 음성 언어 메타데이터가 일치하는 영상만</label><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={reusable} onChange={event => setReusable(event.target.checked)} /> Creative Commons 표시 영상만 보기</label></div>
          <p className="mt-3 text-xs text-slate-500">YouTube 조회수 순 · 검색 1회에 search.list 1회(기본 하루 100회 한도)와 videos.list 1단위를 사용합니다. 엄격 필터는 음성 언어 정보가 없는 영상도 제외하며, 업로더의 메타데이터가 실제 음성을 보증하지 않습니다. CC 표시도 재사용 권한의 최종 확인을 대신하지 않습니다.</p>
          {searchedAt && <p className="mt-2 text-xs text-slate-500">조회 시각: {new Date(searchedAt).toLocaleString('ko-KR')}</p>}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {results.map(video => <article key={video.id} className={`rounded-2xl border p-4 ${selected?.id === video.id ? 'border-emerald-700 bg-emerald-50' : 'border-slate-200'}`}>
              <div className="flex gap-3"><a href={video.url} target="_blank" rel="noopener noreferrer" className="block h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-200"><span role="img" aria-label="YouTube 영상 썸네일" className="block h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${video.thumbnail})` }} /></a><div><p className="text-xs font-black text-red-700">YouTube</p><h3 className="line-clamp-2 font-bold">{video.title}</h3><p className="text-xs text-slate-500">{video.channel} · {Math.round(video.durationSeconds / 60)}분 · 조회 {video.viewCount.toLocaleString()}</p><p className="text-xs text-slate-500">{video.language || '언어 정보 없음'} · {video.license === 'creativeCommon' ? 'CC 표시' : '표준 라이선스'}</p></div></div>
              <button type="button" className="mt-3 rounded-lg border border-emerald-800 px-3 py-1 text-sm font-bold" onClick={() => setSelected(video)}>{selected?.id === video.id ? '참고 중' : '참고 영상으로 선택'}</button>
            </article>)}
          </div>
          {searchedAt && results.length === 0 && <p className="mt-4 text-sm">조건에 맞는 영상이 없습니다. 기간·길이·CC 필터를 완화해보세요.</p>}
        </section>
        <section className="mb-6 rounded-3xl border border-slate-300 bg-white p-6 shadow-[5px_5px_0_#17352d]">
          <div className="mb-5 flex items-center gap-3"><b className="rounded-full bg-sky-200 px-3 py-2">02</b><h2 className="text-2xl font-black">사용권 있는 원본 업로드</h2></div>
          {selected && <p className="mb-4 rounded-xl bg-slate-100 p-3 text-sm">참고 주제: <a className="underline" href={selected.url} target="_blank" rel="noopener noreferrer">{selected.title}</a> — 링크는 참고용이며 영상을 가져오지 않습니다.</p>}
          <input type="file" accept="video/mp4,video/webm,video/quicktime,.mov" onChange={event => { setFile(event.target.files?.[0] || null); setSourceId(''); setUploadedPercent(0); }} className="mb-4 block w-full text-sm" />
          <button className={button} onClick={upload} disabled={!file || !!busy}>{busy === 'upload' ? `업로드 ${uploadedPercent}%` : '원본 업로드'}</button>
          {sourceId && <p className="mt-3 text-sm font-bold text-emerald-800">업로드 완료 · {Math.round(duration)}초</p>}
          <p className="mt-3 text-xs text-slate-500">MP4/WebM/MOV, 200MB 이하, 5초~60분. EC2 디스크와 렌더 CPU를 사용하므로 서비스 운영비는 0원이 아닙니다.</p>
        </section>
        <section className="rounded-3xl border border-slate-300 bg-white p-6 shadow-[5px_5px_0_#17352d]">
          <div className="mb-5 flex items-center gap-3"><b className="rounded-full bg-orange-200 px-3 py-2">03</b><h2 className="text-2xl font-black">클립·자막 편집</h2></div>
          <div className="mb-4 grid gap-3 md:grid-cols-4"><label className="md:col-span-2">제목<input className={field} value={title} onChange={event => setTitle(event.target.value)} maxLength={240} /></label><label>시작 (초)<input type="number" min={0} step="0.1" className={field} value={start} onChange={event => setStart(Number(event.target.value))} /></label><label>끝 (초)<input type="number" min={0} step="0.1" className={field} value={end} onChange={event => setEnd(Number(event.target.value))} /></label></div>
          <p className="mb-4 text-sm text-slate-600">원본 음성을 유지하며 9:16 세로 화면으로 자릅니다. 3~90초 구간을 선택하세요. 자막은 자동 인식이 아닌 직접 입력 방식입니다.</p>
          <div className="space-y-2">{captions.map((caption, index) => <div key={index} className="grid gap-2 md:grid-cols-[100px_100px_1fr_auto]"><input aria-label="자막 시작" type="number" min={0} step="0.1" className={field} value={caption.startSeconds} onChange={event => setCaptions(captions.map((item, i) => i === index ? { ...item, startSeconds: Number(event.target.value) } : item))} /><input aria-label="자막 끝" type="number" min={0} step="0.1" className={field} value={caption.endSeconds} onChange={event => setCaptions(captions.map((item, i) => i === index ? { ...item, endSeconds: Number(event.target.value) } : item))} /><input aria-label="자막 내용" className={field} maxLength={120} value={caption.text} onChange={event => setCaptions(captions.map((item, i) => i === index ? { ...item, text: event.target.value } : item))} /><button type="button" onClick={() => setCaptions(captions.filter((_, i) => i !== index))} className="rounded-lg border px-3">삭제</button></div>)}</div>
          <button type="button" onClick={() => setCaptions([...captions, { startSeconds: 0, endSeconds: Math.min(3, Math.max(0.1, end - start)), text: '' }])} disabled={captions.length >= 20} className="mt-3 rounded-lg border border-slate-400 px-3 py-2 text-sm font-bold">+ 자막 추가</button>
          <div className="mt-6 flex flex-wrap items-center gap-4"><select className="rounded-xl border px-3 py-2" value={quality} onChange={event => setQuality(event.target.value as 'PREVIEW' | 'FINAL')}><option value="PREVIEW">미리보기 540×960</option><option value="FINAL">최종본 1080×1920</option></select><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={rightsConfirmed} onChange={event => setRightsConfirmed(event.target.checked)} /> 원본·음성·자막에 필요한 권리를 확인했습니다.</label></div>
          <button className={`${button} mt-5`} onClick={render} disabled={!sourceId || !rightsConfirmed || !!busy || end - start < 3 || end - start > 90 || end > duration + 0.1}>{busy === 'render' ? '작업 등록 중' : 'MP4 만들기'}</button>
          {job && <div className="mt-5 rounded-xl bg-slate-100 p-4"><b>렌더 상태: {job.stage} ({job.progress}%)</b>{job.status === 'FAILED' && <p className="text-red-700">{job.errorMessage}</p>}{job.status === 'COMPLETED' && <button type="button" onClick={loadOutput} className="ml-3 underline">완료 영상 불러오기</button>}</div>}
          {outputUrl && <div className="mt-5"><video controls src={outputUrl} className="max-h-[600px] rounded-xl bg-black" /><a className="mt-3 inline-block rounded-xl bg-emerald-800 px-4 py-2 font-bold text-white" href={outputUrl} download={`${title || 'shortform'}.mp4`}>MP4 다운로드</a></div>}
        </section>
      </>}
    </div>
  </main>;
}
