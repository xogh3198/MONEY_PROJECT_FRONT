export function IndicatorSkeleton() {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg border border-border p-3 animate-pulse">
          <div className="h-3 w-12 bg-border rounded mb-2" />
          <div className="h-5 w-20 bg-border rounded mb-1" />
          <div className="h-3 w-14 bg-border rounded" />
        </div>
      ))}
    </div>
  );
}

export function NewsListSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-5 py-3 border-b border-border flex justify-between">
        <div className="h-4 w-32 bg-border rounded animate-pulse" />
        <div className="h-3 w-16 bg-border rounded animate-pulse" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="px-5 py-3.5 border-b border-border/30 animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-border rounded" />
            <div className="h-4 w-3/4 bg-border rounded" />
          </div>
          <div className="h-3 w-1/2 bg-border rounded ml-7" />
        </div>
      ))}
    </div>
  );
}

export function ArticleListSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden divide-y divide-border/50">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="px-5 py-4 animate-pulse">
          <div className="flex gap-2 mb-2">
            <div className="h-3 w-16 bg-border rounded" />
            <div className="h-3 w-12 bg-border rounded" />
          </div>
          <div className="h-4 w-4/5 bg-border rounded mb-2" />
          <div className="h-3 w-3/5 bg-border rounded mb-2" />
          <div className="flex gap-3">
            <div className="h-3 w-10 bg-border rounded" />
            <div className="h-3 w-10 bg-border rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
