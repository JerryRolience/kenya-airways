"use client"

import { fetchEmployeeStats } from "@/actions/employees/fetch/fetch-employee-stats"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { Building2, TrendingUp, UserCheck, Users } from "lucide-react"
import { useEffect, useRef } from "react"
import { fmtChange } from "../utils"

export function useFetchEmployeeStats() {
  const query = useQuery({
    queryKey: ["employee-stats"],
    queryFn: async () => {
      const res = await fetchEmployeeStats()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load employee stats.", res.statusCode ?? 500)
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
        title: "Error fetching employee stats",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  const stats = query.data?.data

  const statsData = [
    {
      title: "Total Employees",
      value: stats?.totalEmployees ?? 0,
      change: fmtChange(stats?.newEmployeeChange ?? 0),
      description: `${stats?.newThisMonth ?? 0} new hire${(stats?.newThisMonth ?? 0) === 1 ? "" : "s"} this month`,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      title: "Active Employees",
      value: stats?.activeEmployees ?? 0,
      change: `${Math.round(((stats?.activeEmployees ?? 0) / (stats?.totalEmployees || 1)) * 100)}%`,
      description: `${stats?.inactiveEmployees ?? 0} inactive employee${(stats?.inactiveEmployees ?? 0) === 1 ? "" : "s"}`,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
    },
    {
      title: "Departments",
      value: stats?.totalDepartments ?? 0,
      change: "+0",
      description: `${stats?.byDepartment?.cabinCrew ?? 0} cabin crew, ${stats?.byDepartment?.flightOperations ?? 0} flight ops`,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
    },
    {
      title: "New This Month",
      value: stats?.newThisMonth ?? 0,
      change: fmtChange(stats?.newEmployeeChange ?? 0),
      description: `${stats?.newLastMonth ?? 0} hired last month`,
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
    },
  ]

  return { ...query, statsData }
}
