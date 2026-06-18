import { IndicatorSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-6 w-40 bg-border rounded animate-pulse mb-2" />
        <div className="h-3 w-56 bg-border rounded animate-pulse" />
      </div>
      <IndicatorSkeleton />
      <div className="bg-card border border-border rounded-lg p-5 mt-6 h-[320px] animate-pulse" />
    </div>
  );
}
