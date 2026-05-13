import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StatsCardProps } from "@/types/stats"
import { Minus, TrendingDown, TrendingUp } from "lucide-react"
import Link from "next/link"
import { LoadingStartCard } from "./loading-stats-card"
import { ErrorStatsCard } from "./error-stats-card"

export function StatsCard({ statsData, isLoading, isError, onRetry, message }: StatsCardProps) {
  if (isLoading) return <LoadingStartCard />
  if (isError) return <ErrorStatsCard onRetry={onRetry} message={message} />

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map(stat => (
        <Card key={stat.title} className="overflow-hidden -space-y-4! py-4">
          <CardHeader className="flex flex-row items-center space-y-0 px-4! -pt-4!">
            <div className="p-2 rounded-full border">
              <stat.icon className="h-4 w-4" />
            </div>
            <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <div className="px-4">
            <div className="gap-4 flex items-center">
              <div className="font-bold">{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}</div>
              {stat.change && (
                <Badge
                  variant="outline"
                  className={cn(
                    stat.change.startsWith("+") ? "text-green-700 dark:text-green-400" : stat.change.startsWith("-") ? "text-red-700 dark:text-red-400" : "",
                    "border-border bg-background rounded-sm px-2 flex items-center gap-2",
                  )}
                >
                  {stat.change.startsWith("+") ? <TrendingUp /> : stat.change.startsWith("-") ? <TrendingDown /> : <Minus />}
                  {stat.change}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
            {stat.link && (
              <Link href={stat.link} className="text-xs text-primary hover:underline mt-2 inline-block">
                See details →
              </Link>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
