"use client"

import { fetchDashboardData } from "@/actions/dashboard/fetch-dashboard-data"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { Users, Briefcase, Link as LinkIcon, Ticket } from "lucide-react"
import { useEffect, useRef } from "react"

export function useFetchDashboardData() {
  const query = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      const res = await fetchDashboardData()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load dashboard data.", res.statusCode ?? 500)
      }
      return res
    },
    staleTime: 1000 * 60 * 2,
    placeholderData: prev => prev,
    retry: 1,
  })

  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred. Please try again."

      ErrorHandler({
        title: "Error fetching dashboard data",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  const data = query.data?.data

  const statsData = data
    ? [
        {
          title: "Total Employees",
          value: data.totalEmployees,
          change: `${data.activeEmployees} active`,
          description: `${data.activeEmployees} out of ${data.totalEmployees} employees are currently active`,
          icon: Users,
          link: "/admin/employees",
        },
        {
          title: "Job Openings",
          value: data.totalOpenings,
          change: `${data.openOpenings} open`,
          description: `${data.openOpenings} out of ${data.totalOpenings} openings are currently accepting applications`,
          icon: Briefcase,
          link: "/admin/job-openings",
        },
        {
          title: "Successful Matches",
          value: data.totalMatches,
          change: "+0 this month",
          description: "Employees successfully matched to positions",
          icon: LinkIcon,
          link: "/admin/matches",
        },
        {
          title: "Active Tickets",
          value: data.totalTickets,
          change: `${data.totalTickets} issued`,
          description: "Total active tickets in the system",
          icon: Ticket,
          link: "/admin/tickets",
        },
      ]
    : []

  const recentMatches = data?.recentMatches ?? []
  const recentEmployees = data?.recentEmployees ?? []

  return { ...query, statsData, recentMatches, recentEmployees }
}
