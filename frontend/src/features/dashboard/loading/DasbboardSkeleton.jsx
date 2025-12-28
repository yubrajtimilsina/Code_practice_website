export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-3">
            <div className="h-10 w-96 bg-slate-300 rounded" />
            <div className="h-4 w-64 bg-slate-300 rounded" />
          </div>
          <div className="h-10 w-28 bg-slate-300 rounded-lg" />
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
            >
              <div className="h-10 w-10 bg-slate-300 rounded-lg" />
              <div className="h-4 w-32 bg-slate-300 rounded" />
              <div className="h-10 w-20 bg-slate-300 rounded" />
              <div className="h-3 w-24 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4"
            >
              <div className="h-10 w-10 bg-slate-300 rounded-lg" />
              <div className="h-4 w-40 bg-slate-300 rounded" />
              <div className="h-8 w-24 bg-slate-300 rounded" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-200">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-32 bg-slate-300 rounded" />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="h-6 w-48 bg-slate-300 rounded mb-6" />

          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                <div className="h-4 bg-slate-300 rounded col-span-1" />
                <div className="h-4 bg-slate-300 rounded col-span-2" />
                <div className="h-4 bg-slate-300 rounded col-span-1" />
                <div className="h-4 bg-slate-300 rounded col-span-1" />
                <div className="h-4 bg-slate-300 rounded col-span-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="h-6 w-40 bg-slate-300 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-24 bg-slate-300 rounded" />
                <div className="h-8 w-16 bg-slate-300 rounded" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
