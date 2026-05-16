"use client"

import { fetchUserBookings } from "@/actions/user/bookings/fetch-user-bookings"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { FetchBookingsInput } from "@/validators/booking"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchUserBookings(input: FetchBookingsInput = { limit: 10 }) {
  const query = useQuery({
    queryKey: ["bookings", input],
    queryFn: async () => {
      const res = await fetchUserBookings(input)
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load bookings.", res.statusCode ?? 500)
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

      ErrorHandler({ title: "Error fetching bookings", description: message, action: "error" })
    }

    if (!query.isError) {
      hasToastedError.current = false
    }
  }, [query.isError, query.error])

  return query
}
