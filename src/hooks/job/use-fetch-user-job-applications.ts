"use client"

import { fetchApplications } from "@/actions/job/job-application/fetch/fetch-applications"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { FetchApplicationsInput } from "@/validators/job-application"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

interface UseFetchMyApplicationsParams {
  input?: Omit<FetchApplicationsInput, "userId">
  enabled?: boolean
}

export function useFetchUserApplications({ input = { limit: 10 }, enabled = true }: UseFetchMyApplicationsParams = {}) {
  const query = useQuery({
    queryKey: ["user-applications", input],
    queryFn: async () => {
      // Don't pass userId — the server action will use the authenticated user's ID
      const res = await fetchApplications(input as FetchApplicationsInput)
      if (!res.success) throw new AppError(res.message ?? "Failed to load applications.", res.statusCode ?? 500)
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
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred."
      ErrorHandler({
        title: "Error loading applications",
        description: message,
        action: "error",
      })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
