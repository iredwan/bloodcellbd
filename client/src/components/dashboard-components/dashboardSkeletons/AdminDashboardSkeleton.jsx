export default function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header & Time Filter */}
      <div className="flex md:flex-row flex-col justify-between items-center">
        <div className="h-8 w-60 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-64 h-10 mt-4 md:mt-0 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <div className="h-4 w-24 bg-gray-400 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-6 w-16 bg-gray-500 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-8 w-8 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Request Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <div className="h-4 w-28 bg-gray-400 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-6 w-20 bg-gray-500 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-8 w-8 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg h-[360px]">
            <div className="h-6 w-40 bg-gray-400 dark:bg-gray-600 rounded mb-4"></div>
            <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg h-[360px]">
            <div className="h-6 w-48 bg-gray-400 dark:bg-gray-600 rounded mb-4"></div>
            <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg h-[360px]">
            <div className="h-6 w-64 bg-gray-400 dark:bg-gray-600 rounded mb-4"></div>
            <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Charts Row 4 - Religion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Religion Chart */}
        <div className="p-4 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg h-[360px]">
          <div className="h-6 w-72 bg-gray-400 dark:bg-gray-600 rounded mb-4"></div>
          <div className="w-full h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Placeholder */}
        <div className="lg:block hidden" />
      </div>
    </div>
  );
}
