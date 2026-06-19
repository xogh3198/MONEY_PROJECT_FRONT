'use client';
import { useState } from 'react';

interface Comment {
  id: string; username: string; content: string; createdAt: string;
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([
    { id: '1', username: '?¨ÏûêÍ≥†Ïàò', content: '?¥Î≤à Í≤∞Ï†ï?Ä ?àÏÉÅ???òÏàú?¥Ï£†. ?òÎ∞òÍ∏∞Í? Í¥ÄÍ±¥ÏûÖ?àÎã§.', createdAt: '10Î∂??? },
    { id: '2', username: 'Ï£ºÎ¶∞??, content: 'Ï¥àÎ≥¥?∏Îç∞ ?¥Í≤å Ï£ºÏãù???¥Îñ§ ?ÅÌñ•???àÎÇò??', createdAt: '8Î∂??? },
    { id: '3', username: 'Ï∞®Ìä∏?ÅÏù¥', content: 'Í∏∞Ïà†?ÅÏúºÎ°?Î¥§ÏùÑ ???ÑÏßÅ Í¥ÄÎßùÏù¥ ÎßûÎäî Í≤?Í∞ôÏäµ?àÎã§.', createdAt: '5Î∂??? },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setComments(prev => [...prev, { id: Date.now().toString(), username: '??, content: input, createdAt: 'Î∞©Í∏à' }]);
    setInput('');
  };

  return (
    <div className="pt-4">
      <h4 className="text-sm font-bold text-text-main mb-3">?ìÍ? {comments.length}Í∞?/h4>

      {/* ?ÖÎ†• */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="?òÍ≤¨???®Í≤®Î≥¥ÏÑ∏??.."
          className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-white focus:outline-none focus:border-primary"
        />
        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
          ?±Î°ù
        </button>
      </form>

      {/* Î™©Î°ù */}
      <div className="space-y-2">
        {comments.map(c => (
          <div key={c.id} className="bg-white rounded-md p-3 border border-border">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-primary">{c.username}</span>
              <span className="text-xs text-text-light">{c.createdAt}</span>
            </div>
            <p className="text-sm text-text-main">{c.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
