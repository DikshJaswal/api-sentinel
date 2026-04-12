export default function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
      
      <div className="space-y-4">
        <div className="h-4 bg-white/10 rounded w-1/2" />
        <div className="h-8 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/10 rounded w-1/4" />
      </div>
    </div>
  );
}
