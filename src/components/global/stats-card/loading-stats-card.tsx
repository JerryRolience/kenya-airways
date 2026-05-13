import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingStartCard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden -space-y-4! py-4">
          <CardHeader className="flex flex-row items-center space-y-0 px-4! -pt-4!">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-3 w-28 ml-2" />
          </CardHeader>
          <div className="px-4 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-5 w-14 rounded-sm" />
            </div>
            <Skeleton className="h-3 w-36" />
          </div>
        </Card>
      ))}
    </div>
  )
}
