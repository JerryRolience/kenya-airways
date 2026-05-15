"use client"

import { fetchPassengerStats } from "@/actions/passengers/fetch/fetch-passenger-stats"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { Globe, TrendingUp, UserCheck, Users } from "lucide-react"
import { useEffect, useRef } from "react"
import { fmtChange } from "../utils"

export function useFetchPassengerStats() {
  const query = useQuery({
    queryKey: ["passenger-stats"],
    queryFn: async () => {
      const res = await fetchPassengerStats()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load passenger stats.", res.statusCode ?? 500)
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
        title: "Error fetching passenger stats",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  const stats = query.data?.data

  const statsData = [
    {
      title: "Total Passengers",
      value: stats?.totalPassengers ?? 0,
      change: fmtChange(stats?.newPassengerChange ?? 0),
      description: `${stats?.newThisMonth ?? 0} new passenger${(stats?.newThisMonth ?? 0) === 1 ? "" : "s"} this month`,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-blue-50 border-blue-200",
    },
    {
      title: "Registered Users",
      value: stats?.registeredUsers ?? 0,
      change: `${Math.round(((stats?.registeredUsers ?? 0) / (stats?.totalPassengers || 1)) * 100)}%`,
      description: `${stats?.guestPassengers ?? 0} guest passenger${(stats?.guestPassengers ?? 0) === 1 ? "" : "s"}`,
      icon: UserCheck,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
    },
    {
      title: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      change: fmtChange(0),
      description: `Across all passengers`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
    },
    {
      title: "Nationalities",
      value: stats?.byNationality?.totalNationalities ?? 0,
      change: fmtChange(0),
      description: `${stats?.byNationality?.kenyanPassengers ?? 0} Kenyan passenger${(stats?.byNationality?.kenyanPassengers ?? 0) === 1 ? "" : "s"}`,
      icon: Globe,
      color: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
    },
  ]

  return { ...query, statsData }
}
