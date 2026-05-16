"use client"

import { fetchUserPayments } from "@/actions/user/payments/fetch-user-payments"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { FetchUserPaymentsInput } from "@/validators/payment"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchUserPayments(input: FetchUserPaymentsInput = { limit: 10 }) {
  const query = useQuery({
    queryKey: ["user-payments", input],
    queryFn: async () => {
      const res = await fetchUserPayments(input)
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load user payments.", res.statusCode ?? 500)
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

      ErrorHandler({ title: "Error fetching user payments", description: message, action: "error" })
    }

    if (!query.isError) {
      hasToastedError.current = false
    }
  }, [query.isError, query.error])

  return query
}
