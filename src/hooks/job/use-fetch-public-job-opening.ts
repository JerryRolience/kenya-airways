"use client"

import { fetchPublicJobOpening } from "@/actions/job/job-opening/fetch/public/fetch-public-job-opening"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchJobOpening(id: string) {
  const query = useQuery({
    queryKey: ["public-job-openings", id],
    queryFn: async () => {
      const res = await fetchPublicJobOpening(id)
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load the job opening.", res.statusCode ?? 500)
      }

      return res
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    placeholderData: prev => prev,
  })

  //  Toast on error (fires once per error, resets on recovery) ──
  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred. Please try again."

      ErrorHandler({ title: "Error fetching the job opening", description: message, action: "error" })
    }

    if (!query.isError) {
      hasToastedError.current = false
    }
  }, [query.isError, query.error])

  return query
}
