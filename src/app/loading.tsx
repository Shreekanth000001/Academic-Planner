export default function LoadingDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-8 animate-pulse">
      
      {/* Header Skeleton */}
      <div className="border-b border-gray-800 pb-6">
        <div className="h-8 bg-gray-800 rounded w-64 mb-4"></div>
        <div className="h-4 bg-gray-800 rounded w-96"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form Skeleton */}
        <div className="lg:col-span-1 h-64 bg-gray-900 border border-gray-800 rounded-xl"></div>

        {/* Table Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-12 bg-gray-900 border border-gray-800 rounded-xl"></div>
          <div className="h-16 bg-gray-900 border border-gray-800 rounded-xl"></div>
          <div className="h-16 bg-gray-900 border border-gray-800 rounded-xl"></div>
        </div>
      </div>
      
    </div>
  );
}