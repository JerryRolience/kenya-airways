"use client"

import { fetchAvailableOpenings } from "@/actions/job/job-opening/fetch/fetch-available-openings"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchAvailableOpenings() {
  const query = useQuery({
    queryKey: ["available-openings"],
    queryFn: async () => {
      const res = await fetchAvailableOpenings()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load available openings.", res.statusCode ?? 500)
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
        title: "Error fetching available openings",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
