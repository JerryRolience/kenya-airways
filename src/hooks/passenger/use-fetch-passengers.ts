"use client"

import { fetchPassengers } from "@/actions/passengers/fetch/fetch-passengers"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { FetchPassengersInput } from "@/validators/passenger"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

interface UseFetchPassengersParams {
  input?: FetchPassengersInput
  enabled?: boolean
}

export function useFetchPassengers({ input = { limit: 10 }, enabled = true }: UseFetchPassengersParams = {}) {
  const query = useQuery({
    queryKey: ["passengers", input],
    queryFn: async () => {
      const res = await fetchPassengers(input)
      if (!res.success) {
        throw new AppError(res.message ?? "Failed to load passengers.", res.statusCode ?? 500)
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
        title: "Error fetching passengers",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
