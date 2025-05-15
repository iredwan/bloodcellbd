import { Skeleton } from "@/components/ui/skeleton";

const TeamCardSkeleton = () => {
  return (
    <div className="relative max-w-2xl w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-[18px] shadow-md p-6">
      {/* Header Skeleton */}
      <Skeleton className="absolute -top-4 left-1/2 -translate-x-1/2 h-7 w-32 rounded-full bg-gray-300 dark:bg-gray-700" />

      {/* Content Skeleton */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Image Skeleton */}
        <Skeleton className="w-28 md:w-40 aspect-square rounded-full border border-gray-400 dark:border-gray-600 bg-gray-300 dark:bg-gray-700" />

        {/* Info Skeleton */}
        <div className="w-full space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4 mx-auto md:mx-0 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-5 w-1/2 mx-auto md:mx-0 bg-gray-300 dark:bg-gray-700" />
          </div>

          <div className="flex justify-center md:justify-start items-center gap-2">
            <Skeleton className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
          </div>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <Skeleton className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-5 w-32 bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <Skeleton className="mt-6 h-4 w-1/3 mx-auto bg-gray-300 dark:bg-gray-700" />
    </div>
  );
};

export default TeamCardSkeleton;
