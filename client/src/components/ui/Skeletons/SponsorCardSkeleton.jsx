import { Skeleton } from "@/components/ui/skeleton";

export default function SponsorCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-6 space-y-6 text-center">
      {/* Logo */}
      <div className="flex flex-col items-center space-y-4">
        <Skeleton className="w-40 h-40 rounded-full" />
        <Skeleton className="w-10 h-10 rounded-full" />
      </div>

      {/* Name & Website */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-3/4 mx-auto rounded-md" />
        <Skeleton className="h-4 w-1/2 mx-auto rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>

      {/* Contact Person */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3 mx-auto rounded-md" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-2/3 mx-auto rounded" />
          <Skeleton className="h-4 w-1/2 mx-auto rounded" />
          <Skeleton className="h-4 w-3/4 mx-auto rounded" />
          <Skeleton className="h-4 w-1/3 mx-auto rounded" />
        </div>
      </div>

      {/* Cover Image */}
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}
