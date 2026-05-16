"use client"

import { fetchUserDashboardOverview } from "@/actions/user/dashboard/fetch-user-dashboard-overview"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { Briefcase, Plane, Ticket, TrendingUp } from "lucide-react"
import { useEffect, useRef } from "react"

export function useFetchDashboardOverview() {
  const query = useQuery({
    queryKey: ["user-dashboard-overview"],
    queryFn: async () => {
      const res = await fetchUserDashboardOverview()
      if (!res.success) throw new AppError(res.message ?? "Failed to load dashboard.", res.statusCode ?? 500)
      return res
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: prev => prev,
  })

  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred."
      ErrorHandler({ title: "Error loading dashboard", description: message, action: "error" })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  const data = query.data?.data

  const statsData = data
    ? [
        {
          title: "Upcoming Flights",
          value: data.upcomingBookings,
          description: `${data.totalBookings} total bookings`,
          icon: Plane,
          color: "text-primary",
          bgColor: "bg-blue-50 border-blue-200",
        },
        {
          title: "My Bookings",
          value: data.totalBookings,
          description: "All time",
          icon: Ticket,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50 border-emerald-200",
        },
        {
          title: "Applications",
          value: data.jobApplications,
          description: `${data.activeApplications} active`,
          icon: Briefcase,
          color: "text-purple-600",
          bgColor: "bg-purple-50 border-purple-200",
        },
        {
          title: "Active Applications",
          value: data.activeApplications,
          description: "Being reviewed",
          icon: TrendingUp,
          color: "text-amber-600",
          bgColor: "bg-amber-50 border-amber-200",
        },
      ]
    : []

  return {
    ...query,
    statsData,
    recentBookings: data?.recentBookings ?? [],
    recentApplications: data?.recentApplications ?? [],
  }
}
