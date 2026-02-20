import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-44" />
        </div>
      </div>
      
      <Skeleton className="h-16 w-full rounded-lg" />
      
      <Skeleton className="h-10 w-96" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}
