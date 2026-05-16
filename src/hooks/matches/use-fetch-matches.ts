"use client"

import { fetchMatches } from "@/actions/job/match/fetch/fetch-matches"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { FetchMatchesInput } from "@/validators/match"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchMatches(input: FetchMatchesInput = { limit: 10 }) {
  const query = useQuery({
    queryKey: ["matches", input],
    queryFn: async () => {
      const res = await fetchMatches(input)
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load matches.", res.statusCode ?? 500)
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

      ErrorHandler({ title: "Error fetching matches", description: message, action: "error" })
    }

    if (!query.isError) {
      hasToastedError.current = false
    }
  }, [query.isError, query.error])

  return query
}
