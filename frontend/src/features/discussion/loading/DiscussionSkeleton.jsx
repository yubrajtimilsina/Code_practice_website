 export function DiscussionSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8 animate-pulse">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back button */}
        <div className="h-4 w-32 bg-slate-300 rounded" />

        {/* Discussion Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">

          <div className="flex gap-6">
            {/* Vote */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 bg-slate-300 rounded" />
              <div className="w-6 h-6 bg-slate-300 rounded" />
              <div className="w-8 h-8 bg-slate-300 rounded" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="h-8 w-3/4 bg-slate-300 rounded" />
              <div className="flex gap-3">
                <div className="h-5 w-24 bg-slate-300 rounded-full" />
                <div className="h-5 w-16 bg-slate-300 rounded-full" />
              </div>

              <div className="flex gap-6">
                <div className="h-4 w-24 bg-slate-300 rounded" />
                <div className="h-4 w-24 bg-slate-300 rounded" />
                <div className="h-4 w-24 bg-slate-300 rounded" />
              </div>

              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-300 rounded" />
                <div className="h-4 w-5/6 bg-slate-300 rounded" />
                <div className="h-4 w-2/3 bg-slate-300 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Comments Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="h-6 w-32 bg-slate-300 rounded" />

          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4">
              <div className="w-6 h-16 bg-slate-300 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 bg-slate-300 rounded" />
                <div className="h-4 w-full bg-slate-300 rounded" />
                <div className="h-4 w-3/4 bg-slate-300 rounded" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}