"use client"

import { StatsCard } from "@/components/global/stats-card"
import { Button } from "@/components/ui/button"
import { useFetchPassengerStats } from "@/hooks/passenger/use-fetch-passenger-stats"
import { RefreshCw } from "lucide-react"
import { PassengersTable } from "./_components/passengers-table"

export default function PassengersPage() {
  const { isLoading: statsLoading, statsData, isError, refetch, error, isFetching: statsFetching } = useFetchPassengerStats()

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 py-3 sm:py-4 w-full min-w-0">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Passengers</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Manage passenger profiles and travel documents</p>
        </div>

        <div className="self-start sm:self-auto shrink-0 gap-2 flex flex-col sm:flex-row">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs hover:cursor-pointer" onClick={() => refetch()} disabled={statsFetching}>
            <RefreshCw className={`h-3.5 w-3.5 ${statsFetching ? "animate-spin" : ""}`} />
            <span className="inline">Refresh Stats</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCard statsData={statsData} isLoading={statsLoading} isError={isError} onRetry={refetch} message={error?.message ?? "Failed to load statistics."} />

      {/* Passengers table */}
      <PassengersTable />
    </div>
  )
}
