'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { value: 'DOMESTIC', label: 'êµ?‚´ì¦ì‹œ' },
  { value: 'OVERSEAS', label: '?´ì™¸ì¦ì‹œ' },
  { value: 'FOREX', label: '?˜ìœ¨' },
  { value: 'CRYPTO', label: '?”í˜¸?”í' },
  { value: 'REAL_ESTATE', label: 'ë¶€?™ì‚°' },
  { value: 'FREE', label: '?ìœ ' },
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
    if (!title.trim()) { setError('?œëª©???…ë ¥?´ì£¼?¸ìš”'); return; }
    if (!content.trim()) { setError('?´ìš©???…ë ¥?´ì£¼?¸ìš”'); return; }
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
        setError(data.message || 'ê²Œì‹œê¸€ ?‘ì„±???¤íŒ¨?ˆìŠµ?ˆë‹¤');
      }
    } catch {
      setError('?œë²„ ?°ê²°???¤íŒ¨?ˆìŠµ?ˆë‹¤');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">ê²Œì‹œê¸€ ?‘ì„±</h1>
      {error && (
        <div className="bg-negative/10 border border-negative/30 text-negative rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1">ì¹´í…Œê³ ë¦¬</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-text-primary focus:outline-none focus:border-accent">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">?œëª© ({title.length}/100)</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 100))}
            placeholder="?œëª©???…ë ¥?˜ì„¸?? maxLength={100}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-text-primary focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1">?´ìš© ({content.length}/5000)</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value.slice(0, 5000))}
            placeholder="?´ìš©???…ë ¥?˜ì„¸?? maxLength={5000} rows={12}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card text-text-primary focus:outline-none focus:border-accent resize-none" />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => router.back()}
            className="px-4 py-2 text-sm bg-card border border-border text-text-secondary rounded-lg hover:text-text-primary">
            ì·¨ì†Œ
          </button>
          <button type="submit" disabled={submitting}
            className="px-6 py-2 text-sm font-medium bg-accent text-black rounded-lg hover:opacity-90 disabled:opacity-50">
            {submitting ? '?‘ì„± ì¤?..' : 'ê²Œì‹œ?˜ê¸°'}
          </button>
        </div>
      </form>
    </div>
  );
}
