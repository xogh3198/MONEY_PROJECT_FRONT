'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { value: 'DOMESTIC', label: '국내증시' },
  { value: 'OVERSEAS', label: '해외증시' },
  { value: 'FOREX', label: '환율' },
  { value: 'CRYPTO', label: '암호화폐' },
  { value: 'REAL_ESTATE', label: '부동산' },
  { value: 'FREE', label: '자유' },
];

export default function CommunityWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('FREE');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('제목을 입력해주세요'); return; }
    if (!content.trim()) { setError('내용을 입력해주세요'); return; }
    setError('');
    setSubmitting(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), category }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/forum/community/${data.id}`);
      } else {
        const data = await res.json();
        setError(data.message || '게시글 작성에 실패했습니다');
      }
    } catch {
      setError('서버 연결에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">게시글 작성</h1>
      {error && (
        <div className="bg-negative/10 border border-negative/30 text-negative rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">카테고리</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-text-primary focus:outline-none focus:border-accent">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">제목 ({title.length}/100)</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 100))}
            placeholder="제목을 입력하세요" maxLength={100}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-text-primary focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">내용 ({content.length}/5000)</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value.slice(0, 5000))}
            placeholder="내용을 입력하세요" maxLength={5000} rows={12}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-text-primary focus:outline-none focus:border-accent resize-none" />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2 text-sm bg-card border border-border text-text-secondary rounded-lg hover:text-text-primary">
            취소
          </button>
          <button type="submit" disabled={submitting}
            className="px-6 py-2 text-sm font-medium bg-accent text-black rounded-lg hover:opacity-90 disabled:opacity-50">
            {submitting ? '작성 중...' : '게시하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
