"use client"

import { fetchMatchesReport } from "@/actions/reports/fetch-matches-report"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchMatchesReport() {
  const query = useQuery({
    queryKey: ["matches-report"],
    queryFn: async () => {
      const res = await fetchMatchesReport()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load matches report.", res.statusCode ?? 500)
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
        title: "Error fetching matches report",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
