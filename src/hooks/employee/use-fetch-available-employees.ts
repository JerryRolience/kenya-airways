"use client"

import { fetchAvailableEmployees } from "@/actions/employees/fetch/fetch-available-employees"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

interface UseFetchAvailableEmployeesParams {
  openingId: string | null
  enabled?: boolean
}

export function useFetchAvailableEmployees({ openingId, enabled = true }: UseFetchAvailableEmployeesParams) {
  const query = useQuery({
    queryKey: ["available-employees", openingId],
    queryFn: async () => {
      if (!openingId) {
        throw new AppError("No opening selected.", 400)
      }
      const res = await fetchAvailableEmployees(openingId)
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load available employees.", res.statusCode ?? 500)
      }
      return res
    },
    enabled: enabled && !!openingId,
    staleTime: 1000 * 60 * 2,
    placeholderData: prev => prev,
  })

  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred."

      ErrorHandler({
        title: "Error fetching available employees",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
