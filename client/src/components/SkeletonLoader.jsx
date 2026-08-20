export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="glass-card p-5 space-y-3">
            <div className="skeleton h-5 w-2/3 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-3/4 rounded" />
          </div>
        );
      case 'list':
        return (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3">
                <div className="skeleton w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        );
      case 'chat':
        return (
          <div className="space-y-4 p-4">
            <div className="flex justify-start">
              <div className="skeleton h-16 w-2/3 rounded-2xl" />
            </div>
            <div className="flex justify-end">
              <div className="skeleton h-12 w-1/2 rounded-2xl" />
            </div>
            <div className="flex justify-start">
              <div className="skeleton h-20 w-3/4 rounded-2xl" />
            </div>
          </div>
        );
      default:
        return <div className="skeleton h-20 w-full rounded-xl" />;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </>
  );
}
