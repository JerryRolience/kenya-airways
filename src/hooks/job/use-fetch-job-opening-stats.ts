"use client"

import { fetchJobOpeningStats } from "@/actions/job/job-opening/fetch/fetch-job-opening-stats"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { Briefcase, FileCheck, TrendingUp, Building2 } from "lucide-react"
import { useEffect, useRef } from "react"
import { fmtChange } from "../utils"

export function useFetchJobOpeningStats() {
  const query = useQuery({
    queryKey: ["job-opening-stats"],
    queryFn: async () => {
      const res = await fetchJobOpeningStats()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load job opening stats.", res.statusCode ?? 500)
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
        title: "Error fetching job opening stats",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  const stats = query.data?.data

  const statsData = [
    {
      title: "Total Openings",
      value: stats?.totalOpenings ?? 0,
      change: fmtChange(stats?.newOpeningChange ?? 0),
      description: `${stats?.newThisMonth ?? 0} new opening${(stats?.newThisMonth ?? 0) === 1 ? "" : "s"} this month`,
      icon: Briefcase,
      color: "text-primary",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      title: "Currently Open",
      value: stats?.openCount ?? 0,
      change: `${Math.round(((stats?.openCount ?? 0) / (stats?.totalOpenings || 1)) * 100)}%`,
      description: `${stats?.departmentsHiring ?? 0} department${(stats?.departmentsHiring ?? 0) === 1 ? "" : "s"} hiring`,
      icon: FileCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
    },
    {
      title: "Total Applications",
      value: stats?.totalApplications ?? 0,
      change: fmtChange(0),
      description: `Across all openings`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
    },
    {
      title: "Departments Hiring",
      value: stats?.departmentsHiring ?? 0,
      change: fmtChange(0),
      description: `${stats?.closedCount ?? 0} closed position${(stats?.closedCount ?? 0) === 1 ? "" : "s"}`,
      icon: Building2,
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
    },
  ]

  return { ...query, statsData }
}
