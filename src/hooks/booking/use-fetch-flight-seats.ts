"use client"

import { fetchFlightSeats } from "@/actions/bookings/fetch/fetch-flight-seats"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchFlightSeats(flightId: string) {
  const query = useQuery({
    queryKey: ["flight-seats", flightId],
    queryFn: async () => {
      if (!flightId) {
        throw new AppError("No flight ID provided.", 400)
      }
      const res = await fetchFlightSeats(flightId)
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load seat map.", res.statusCode ?? 500)
      }
      return res
    },
    enabled: !!flightId,
    staleTime: 1000 * 60 * 2, // 2 minutes — seats change frequently
    placeholderData: prev => prev,
    retry: 1,
  })

  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred while loading the seat map."

      ErrorHandler({
        title: "Error loading seat map",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
