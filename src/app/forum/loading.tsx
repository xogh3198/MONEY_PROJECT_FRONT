import { ArticleListSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div>
      <div className="mb-5">
        <div className="h-6 w-24 bg-border rounded animate-pulse mb-2" />
        <div className="h-3 w-48 bg-border rounded animate-pulse" />
      </div>
      <ArticleListSkeleton />
    </div>
  );
}
