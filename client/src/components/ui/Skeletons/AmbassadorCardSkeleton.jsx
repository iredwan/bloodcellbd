import { Skeleton } from "@/components/ui/skeleton";

export default function AmbassadorCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden text-center">
      {/* Image Skeleton */}
      <div className="relative w-full h-40 bg-primary flex justify-center items-end pb-4">
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-40 h-40">
          <Skeleton className="w-full h-full rounded-full ring-4 ring-white dark:ring-gray-800" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="pt-20 pb-6 px-6 space-y-4">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto" />
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-3 mt-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
