"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, Link as LinkIcon, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface RecentMatchesProps {
  matches: any[]
  isLoading: boolean
  isError: boolean
  errorMessage: string
  onRetry: () => void
  isFetching: boolean
}

export function RecentMatches({ matches, isLoading, isError, errorMessage, onRetry, isFetching }: RecentMatchesProps) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">Recent Matches</CardTitle>
        <Link href="/admin/matches">
          <Button variant="ghost" size="sm" className="text-xs text-accent hover:cursor-pointer">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-destructive/60 mx-auto" />
            <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
            <Button variant="outline" size="sm" onClick={onRetry} disabled={isFetching} className="mt-3 rounded-xl text-xs gap-1.5">
              <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
              Retry
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && matches.length === 0 && (
          <div className="text-center py-8">
            <LinkIcon className="h-8 w-8 text-muted-foreground/40 mx-auto" />
            <p className="mt-2 text-sm text-muted-foreground">No matches yet</p>
          </div>
        )}

        {/* Data State */}
        {!isLoading && !isError && matches.length > 0 && (
          <div className="space-y-3">
            {matches.map(match => (
              <div key={match.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <LinkIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {match.employee.firstName} {match.employee.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {match.employee.position} → {match.opening.title}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0">
                  Active
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
