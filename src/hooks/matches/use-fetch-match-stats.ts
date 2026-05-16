"use client"

import { fetchMatchStats } from "@/actions/job/match/fetch/fetch-match-stats"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { Link as LinkIcon, TrendingUp, FileCheck, Building2 } from "lucide-react"
import { useEffect, useRef } from "react"
import { fmtChange } from "../utils"

export function useFetchMatchStats() {
  const query = useQuery({
    queryKey: ["match-stats"],
    queryFn: async () => {
      const res = await fetchMatchStats()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load match stats.", res.statusCode ?? 500)
      }
      return res
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  })

  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred. Please try again."

      ErrorHandler({
        title: "Error fetching match stats",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  const stats = query.data?.data

  const statsData = [
    {
      title: "Total Matches",
      value: stats?.totalMatches ?? 0,
      change: fmtChange(stats?.newMatchChange ?? 0),
      description: `${stats?.newThisMonth ?? 0} new match${(stats?.newThisMonth ?? 0) === 1 ? "" : "es"} this month`,
      icon: LinkIcon,
      color: "text-primary",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      title: "Active Matches",
      value: stats?.activeMatches ?? 0,
      change: `${Math.round(((stats?.activeMatches ?? 0) / (stats?.totalMatches || 1)) * 100)}%`,
      description: `${stats?.closedMatches ?? 0} closed match${(stats?.closedMatches ?? 0) === 1 ? "" : "es"}`,
      icon: FileCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
    },
    {
      title: "New This Month",
      value: stats?.newThisMonth ?? 0,
      change: fmtChange(stats?.newMatchChange ?? 0),
      description: `${stats?.newLastMonth ?? 0} last month`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
    },
    {
      title: "Departments",
      value: stats?.departmentsWithMatches ?? 0,
      change: fmtChange(0),
      description: `${stats?.byDepartment?.cabinCrew ?? 0} cabin crew, ${stats?.byDepartment?.flightOperations ?? 0} flight ops`,
      icon: Building2,
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
    },
  ]

  return { ...query, statsData }
}
