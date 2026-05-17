"use client"

import { fetchProfile } from "@/actions/user/profile"
import { ErrorHandler } from "@/components/global/error-handler"
import { AppError } from "@/lib/app-error"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function useFetchProfile() {
  const query = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetchProfile()
      if (!res.success) throw new AppError(res.message ?? "Failed to load profile.", res.statusCode ?? 500)
      return res
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  })

  const hasToastedError = useRef(false)

  useEffect(() => {
    if (query.isError && !hasToastedError.current) {
      hasToastedError.current = true
      const message = query.error instanceof AppError ? query.error.message : "An unexpected error occurred."
      ErrorHandler({ title: "Error loading profile", description: message, action: "error" })
    }
    if (!query.isError) hasToastedError.current = false
  }, [query.isError, query.error])

  return query
}
