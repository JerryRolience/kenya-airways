"use client"

import { fetchPublicJobOpenings } from "@/actions/job/job-opening/fetch/public/fetch-public-job-openings"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchPublicJobOpenings() {
  const query = useQuery({
    queryKey: ["public-job-openings"],
    queryFn: async () => {
      const res = await fetchPublicJobOpenings()
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load job openings.", res.statusCode ?? 500)
      }

      return res
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    placeholderData: prev => prev,
  })

  // ── Toast on error (fires once per error, resets on recovery) ──
  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred. Please try again."

      ErrorHandler({ title: "Error fetching job openings", description: message, action: "error" })
    }

    if (!query.isError) {
      hasToastedError.current = false
    }
  }, [query.isError, query.error])

  return query
}
