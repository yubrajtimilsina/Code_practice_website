import React from 'react';

const SkeletonBox = ({ width = "w-full", height = "h-4", className = "" }) => (
  <div className={`${width} ${height} bg-slate-200 rounded animate-pulse ${className}`} />
);

// Circle skeleton (for avatars)
const SkeletonCircle = ({ size = "w-10 h-10", className = "" }) => (
  <div className={`${size} bg-slate-200 rounded-full animate-pulse ${className}`} />
);

export const TableSkeleton = ({ 
  rows = 10, 
  columns = 6,
  showHeader = true 
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
    <table className="w-full">
      {showHeader && (
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {[...Array(columns)].map((_, i) => (
              <th key={i} className="px-6 py-4 text-left">
                <SkeletonBox width="w-20" height="h-4" />
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {[...Array(rows)].map((_, rowIdx) => (
          <tr key={rowIdx} className="border-b border-slate-100">
            {[...Array(columns)].map((_, colIdx) => (
              <td key={colIdx} className="px-6 py-4">
                <SkeletonBox width="w-24" height="h-4" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


export const CardGridSkeleton = ({ 
  count = 6, 
  columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
}) => (
  <div className={`grid ${columns} gap-6`}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white border border-slate-200 rounded-lg p-5">
        <SkeletonBox width="w-3/4" height="h-6" className="mb-4" />
        <SkeletonBox width="w-full" height="h-4" className="mb-2" />
        <SkeletonBox width="w-2/3" height="h-4" className="mb-4" />
        <div className="flex gap-2">
          <SkeletonBox width="w-16" height="h-6" className="rounded-full" />
          <SkeletonBox width="w-20" height="h-6" className="rounded-full" />
        </div>
      </div>
    ))}
  </div>
);


export const StatsGridSkeleton = ({ 
  count = 4, 
  columns = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" 
}) => (
  <div className={`grid ${columns} gap-6`}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6">
        <SkeletonBox width="w-10" height="h-10" className="rounded-lg mb-4" />
        <SkeletonBox width="w-32" height="h-4" className="mb-2" />
        <SkeletonBox width="w-20" height="h-8" className="mb-2" />
        <SkeletonBox width="w-24" height="h-3" />
      </div>
    ))}
  </div>
);


export const ListSkeleton = ({ count = 10 }) => (
  <div className="space-y-3">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-4">
        <SkeletonCircle size="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <SkeletonBox width="w-3/4" height="h-4" />
          <SkeletonBox width="w-1/2" height="h-3" />
        </div>
        <SkeletonBox width="w-20" height="h-8" className="rounded-full" />
      </div>
    ))}
  </div>
);


export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-slate-100 p-6 md:p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <SkeletonBox width="w-96" height="h-10" />
          <SkeletonBox width="w-64" height="h-4" />
        </div>
        <SkeletonBox width="w-28" height="h-10" className="rounded-lg" />
      </div>

      {/* Main Stats */}
      <StatsGridSkeleton count={5} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-5" />

      {/* Secondary Stats */}
      <StatsGridSkeleton count={4} />

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200">
        {[...Array(4)].map((_, i) => (
          <SkeletonBox key={i} width="w-32" height="h-10" />
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <SkeletonBox width="w-48" height="h-6" className="mb-6" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4">
              <SkeletonBox height="h-4" />
              <SkeletonBox height="h-4" className="col-span-2" />
              <SkeletonBox height="h-4" />
              <SkeletonBox height="h-4" />
              <SkeletonBox height="h-4" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <SkeletonBox width="w-40" height="h-6" className="mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <SkeletonBox width="w-24" height="h-4" />
              <SkeletonBox width="w-16" height="h-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


export const ProfileSkeleton = () => (
  <div className="min-h-screen bg-slate-100 p-6 md:p-8">
    <div className="max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200">
        <div className="flex items-center gap-6 mb-6">
          <SkeletonCircle size="w-24 h-24" />
          <div className="flex-1 space-y-3">
            <SkeletonBox width="w-48" height="h-8" />
            <SkeletonBox width="w-32" height="h-4" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
            <SkeletonBox width="w-32" height="h-6" className="mb-4" />
            <SkeletonBox width="w-24" height="h-10" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const ProblemDetailsSkeleton = () => (
  <div className="min-h-screen bg-slate-100 p-6 md:p-8">
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200">
        <SkeletonBox width="w-3/4" height="h-10" className="mb-4" />
        <div className="flex gap-3">
          <SkeletonBox width="w-20" height="h-6" className="rounded-full" />
          <SkeletonBox width="w-24" height="h-6" className="rounded-full" />
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-3">
        <SkeletonBox width="w-40" height="h-6" className="mb-4" />
        <SkeletonBox width="w-full" height="h-4" />
        <SkeletonBox width="w-5/6" height="h-4" />
        <SkeletonBox width="w-4/6" height="h-4" />
      </div>

      {/* Examples */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-4">
        <SkeletonBox width="w-32" height="h-6" className="mb-4" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-slate-50 rounded-lg p-4 space-y-2">
            <SkeletonBox width="w-full" height="h-4" />
            <SkeletonBox width="w-3/4" height="h-4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const DiscussionSkeleton = () => (
  <div className="min-h-screen bg-slate-100 p-6 md:p-8">
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <SkeletonBox width="w-32" height="h-4" />

      {/* Discussion Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex gap-6">
          {/* Vote */}
          <div className="flex flex-col items-center gap-3">
            <SkeletonBox width="w-8" height="h-8" />
            <SkeletonBox width="w-6" height="h-6" />
            <SkeletonBox width="w-8" height="h-8" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-4">
            <SkeletonBox width="w-3/4" height="h-8" />
            <div className="flex gap-3">
              <SkeletonBox width="w-24" height="h-5" className="rounded-full" />
              <SkeletonBox width="w-16" height="h-5" className="rounded-full" />
            </div>

            <div className="flex gap-6">
              <SkeletonBox width="w-24" height="h-4" />
              <SkeletonBox width="w-24" height="h-4" />
              <SkeletonBox width="w-24" height="h-4" />
            </div>

            <div className="space-y-3">
              <SkeletonBox width="w-full" height="h-4" />
              <SkeletonBox width="w-5/6" height="h-4" />
              <SkeletonBox width="w-2/3" height="h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
        <SkeletonBox width="w-32" height="h-6" />
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <SkeletonBox width="w-6" height="h-16" />
            <div className="flex-1 space-y-2">
              <SkeletonBox width="w-1/4" height="h-4" />
              <SkeletonBox width="w-full" height="h-4" />
              <SkeletonBox width="w-3/4" height="h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const FormSkeleton = ({ fields = 5 }) => (
  <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
    <SkeletonBox width="w-64" height="h-8" className="mb-6" />
    
    {[...Array(fields)].map((_, i) => (
      <div key={i}>
        <SkeletonBox width="w-32" height="h-4" className="mb-2" />
        <SkeletonBox width="w-full" height="h-12" className="rounded-lg" />
      </div>
    ))}

    <div className="flex gap-4 pt-6">
      <SkeletonBox width="w-32" height="h-12" className="rounded-lg" />
      <SkeletonBox width="w-32" height="h-12" className="rounded-lg" />
    </div>
  </div>
);


export const SubmissionDetailsSkeleton = () => (
  <div className="min-h-screen bg-slate-100 p-6 md:p-8">
    <div className="max-w-6xl mx-auto">
      <SkeletonBox width="w-32" height="h-4" className="mb-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200">
              <SkeletonBox width="w-40" height="h-6" className="mb-4" />
              <div className="space-y-3">
                <SkeletonBox width="w-full" height="h-4" />
                <SkeletonBox width="w-3/4" height="h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <SkeletonBox width="w-32" height="h-6" className="mb-4" />
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              {[...Array(15)].map((_, i) => (
                <SkeletonBox key={i} width="w-full" height="h-4" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


export const PageHeaderSkeleton = () => (
  <div className="mb-8">
    <SkeletonBox width="w-96" height="h-10" className="mb-4" />
    <SkeletonBox width="w-64" height="h-4" />
  </div>
);


export const FullPageLoader = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
      <p className="text-blue-700 font-medium">{message}</p>
    </div>
  </div>
);

 export const LeaderboardSkeletonRow = () => (
        <tr className="animate-pulse">
            <td className="px-6 py-4">
                <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
            </td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                    <div>
                        <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
                        <div className="h-3 w-32 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="h-5 w-20 bg-slate-200 rounded-full"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 w-24 bg-slate-200 rounded"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 w-28 bg-slate-200 rounded"></div>
            </td>
            <td className="px-6 py-4">
                <div className="h-4 w-16 bg-slate-200 rounded"></div>
            </td>
        </tr>
    );


// Export all components
export default {
  Table: TableSkeleton,
  CardGrid: CardGridSkeleton,
  StatsGrid: StatsGridSkeleton,
  List: ListSkeleton,
  Dashboard: DashboardSkeleton,
  Profile: ProfileSkeleton,
  ProblemDetails: ProblemDetailsSkeleton,
  Discussion: DiscussionSkeleton,
  Form: FormSkeleton,
  SubmissionDetails: SubmissionDetailsSkeleton,
  PageHeader: PageHeaderSkeleton,
  FullPage: FullPageLoader,
  LeaderboardRow: LeaderboardSkeletonRow,
};
