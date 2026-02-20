import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-lg border">
        <div className="p-4 border-b">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4" />
            ))}
          </div>
        </div>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="p-4 border-b">
            <div className="grid grid-cols-6 gap-4 items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              {[...Array(5)].map((_, j) => (
                <Skeleton key={j} className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
