"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

interface UseFetchPassengerDetailParams {
  passengerId: string | null
  enabled?: boolean
}

// Import this action once you create it
// import { fetchPassengerById } from "@/actions/passengers/fetch-passenger-by-id";

export function useFetchPassengerDetail({ passengerId, enabled = true }: UseFetchPassengerDetailParams) {
  const query = useQuery({
    queryKey: ["passenger-detail", passengerId],
    queryFn: async () => {
      if (!passengerId) {
        throw new AppError("No passenger ID provided.", 400)
      }
      // Replace with actual action once created
      // const res = await fetchPassengerById(passengerId);
      const res = { success: false, message: "Action not implemented yet" }
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load passenger details.", 500)
      }
      return res
    },
    enabled: enabled && !!passengerId,
    staleTime: 1000 * 60 * 2,
    placeholderData: prev => prev,
    retry: 1,
  })

  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred. Please try again."

      ErrorHandler({
        title: "Error fetching passenger details",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
