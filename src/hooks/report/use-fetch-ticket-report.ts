"use client"

import { fetchTicketReport } from "@/actions/reports/fetch-ticket-report"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

interface UseFetchTicketReportParams {
  search?: string
  flightNumber?: string
  class?: string
  status?: string
  fromDate?: string
  toDate?: string
}

export function useFetchTicketReport(input: UseFetchTicketReportParams = {}) {
  const query = useQuery({
    queryKey: ["ticket-report", input],
    queryFn: async () => {
      const res = await fetchTicketReport(input)
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load ticket report.", res.statusCode ?? 500)
      }
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

      ErrorHandler({
        title: "Error fetching ticket report",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
