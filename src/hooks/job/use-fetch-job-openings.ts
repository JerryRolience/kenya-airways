"use client"

import { fetchJobOpenings } from "@/actions/job/job-opening/fetch/fetch-job-openings"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

interface UseFetchJobOpeningsParams {
  enabled?: boolean
}

export function useFetchJobOpenings({ enabled = true }: UseFetchJobOpeningsParams = {}) {
  const query = useQuery({
    queryKey: ["admin-job-openings"],
    queryFn: async () => {
      const res = await fetchJobOpenings()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load job openings.", res.statusCode ?? 500)
      }
      return res
    },
    enabled,
    staleTime: 1000 * 60 * 2,
    placeholderData: prev => prev,
  })

  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred. Please try again."

      ErrorHandler({
        title: "Error fetching job openings",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
