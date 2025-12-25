interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = '', width = '100%', height = '1rem' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <Skeleton width="60%" height="1.5rem" />
        <Skeleton width="20%" height="1rem" />
      </div>
      <div className="space-y-3">
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="80%" height="1rem" />
        <Skeleton width="90%" height="1rem" />
      </div>
      <div className="flex justify-between items-center mt-6">
        <Skeleton width="30%" height="1rem" />
        <Skeleton width="25%" height="2rem" />
      </div>
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <Skeleton width="30%" height="1rem" className="mb-2" />
        <Skeleton width="100%" height="2.5rem" />
      </div>
      <div>
        <Skeleton width="25%" height="1rem" className="mb-2" />
        <Skeleton width="100%" height="6rem" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Skeleton width="40%" height="1rem" className="mb-2" />
          <Skeleton width="100%" height="2.5rem" />
        </div>
        <div>
          <Skeleton width="35%" height="1rem" className="mb-2" />
          <Skeleton width="100%" height="2.5rem" />
        </div>
      </div>
      <Skeleton width="30%" height="3rem" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}