"use client"

import { fetchJobOpenings } from "@/actions/job/job-opening/fetch/fetch-job-openings"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { FetchJobOpeningInput } from "@/validators/job-opening"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchJobOpenings(input: FetchJobOpeningInput = { limit: 10 }) {
  const query = useQuery({
    queryKey: ["admin-job-openings", input],
    queryFn: async () => {
      const res = await fetchJobOpenings(input)
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
