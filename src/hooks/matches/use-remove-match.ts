"use client"

import { removeMatch } from "@/actions/job/match/un-matching-employee-to-job-opening"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseRemoveMatchParams {
  matchId: string
  onSuccess?: () => void
}

export function useRemoveMatch({ matchId, onSuccess }: UseRemoveMatchParams) {
  const queryClient = useQueryClient()

  const { mutate: onRemoveMatch, isPending } = useMutation({
    mutationFn: () => removeMatch(matchId),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({ title: "Match removed successfully", description: res.message, action: "success" })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["matches"] })
        queryClient.invalidateQueries({ queryKey: ["match-stats"] })
        onSuccess?.()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: "Failed to remove match",
          description: res.message ?? "Something went wrong. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong. Please try again."

      ErrorHandler({ title: "Failed to remove Match", description, action: "error" })
    },
  })

  return { onRemoveMatch, isPending }
}
