"use client"

import { updateJobOpening } from "@/actions/job/job-opening/update"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { JobOpeningListItem } from "@/types/job-opening"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseToggleJobOpeningStatusParams {
  opening: JobOpeningListItem
  onSuccess?: () => void
}
export function useToggleJobOpeningStatus({ opening, onSuccess }: UseToggleJobOpeningStatusParams) {
  const queryClient = useQueryClient()

  const { mutate: onToggleJobOpeningStatus, isPending } = useMutation({
    mutationFn: () => updateJobOpening({ id: opening.id, isOpen: !opening.isOpen }),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: `Job opening ${opening.isOpen ? "opened" : "closed"} successfully`,
          description: res.message,
          action: "success",
        })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["public-job-openings"] })
        queryClient.invalidateQueries({ queryKey: ["admin-job-openings"] })
        queryClient.invalidateQueries({ queryKey: ["job-opening-stats"] })
        queryClient.invalidateQueries({ queryKey: ["job-opening-options"] })
        onSuccess?.()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: `Failed to ${opening.isOpen ? "close" : "open"} job opening`,
          description: res.message ?? `Something went wrong while ${opening.isOpen ? "closing" : "opening"} the job opening. Please try again.`,
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description =
        error instanceof HttpError ? error.message : error instanceof Error ? error.message : `Something went wrong while ${opening.isOpen ? "closing" : "opening"} the job opening. Please try again.`

      ErrorHandler({ title: `Failed to ${opening.isOpen ? "close" : "open"} job opening`, description, action: "error" })
    },
  })

  return { onToggleJobOpeningStatus, isPending }
}
