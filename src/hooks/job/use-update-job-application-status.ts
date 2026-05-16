"use client"

import { updateApplicationStatus } from "@/actions/job/job-application/update/update-application-status"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApplicationStatus } from "../../../generated/prisma/enums"

export function useUpdateJobApplicationStatus(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const { mutate: onUpdateJobApplicationStatus, isPending } = useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) => updateApplicationStatus({ applicationId, status }),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: `Job application status updated successfully`,
          description: res.message,
          action: "success",
        })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["job-applications"] })
        queryClient.invalidateQueries({ queryKey: ["user-applications"] })
        queryClient.invalidateQueries({ queryKey: ["employees"] })
        queryClient.invalidateQueries({ queryKey: ["employee-stats"] })
        queryClient.invalidateQueries({ queryKey: ["matches"] })
        queryClient.invalidateQueries({ queryKey: ["match-stats"] })
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
        onSuccess?.()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: `Failed to update job application status`,
          description: res.message ?? `Something went wrong while updating the job application status. Please try again.`,
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : `Something went wrong while updating the job application status. Please try again.`

      ErrorHandler({ title: `Failed to update job application status`, description, action: "error" })
    },
  })

  return { onUpdateJobApplicationStatus, isPending }
}
