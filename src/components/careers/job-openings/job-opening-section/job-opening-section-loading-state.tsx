import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function JobOpeningSectionLoadingState() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3, 4, 5].map(i => (
        <Card key={i} className="border-border/60 bg-card p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-48 rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-9 w-28 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
  )
}
