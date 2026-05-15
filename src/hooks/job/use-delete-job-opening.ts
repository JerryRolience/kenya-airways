"use client"

import { deleteJobOpening } from "@/actions/job/job-opening/delete"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseDeleteJobOpeningParams {
  openingId: string
  onSuccess?: () => void
}

export function useDeleteJobOpening({ openingId, onSuccess }: UseDeleteJobOpeningParams) {
  const queryClient = useQueryClient()

  const { mutate: onDeleteJobOpening, isPending } = useMutation({
    mutationFn: () => deleteJobOpening(openingId),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({ title: "Job opening deleted successfully", description: res.message, action: "success" })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["public-job-openings"] })
        queryClient.invalidateQueries({ queryKey: ["admin-job-openings"] })
        queryClient.invalidateQueries({ queryKey: ["job-opening-stats"] })
        queryClient.invalidateQueries({ queryKey: ["job-opening-options"] })
        onSuccess?.()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: "Failed to delete job opening",
          description: res.message ?? "Something went wrong. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong. Please try again."

      ErrorHandler({ title: "Failed to delete Job Opening", description, action: "error" })
    },
  })

  return { onDeleteJobOpening, isPending }
}
