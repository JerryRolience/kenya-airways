"use client"

import { deletePassenger } from "@/actions/passengers/delete"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseDeletePassengerParams {
  passengerId: string
  onSuccess?: () => void
}

export function useDeletePassenger({ passengerId, onSuccess }: UseDeletePassengerParams) {
  const queryClient = useQueryClient()

  const { mutate: onDeletePassenger, isPending } = useMutation({
    mutationFn: () => deletePassenger(passengerId),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({ title: "Passenger deleted successfully", description: res.message, action: "success" })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["passengers"] })
        queryClient.invalidateQueries({ queryKey: ["passenger-stats"] })
        onSuccess?.()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: "Failed to delete passenger",
          description: res.message ?? "Something went wrong. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong. Please try again."

      ErrorHandler({ title: "Failed to delete Passenger", description, action: "error" })
    },
  })

  return { onDeletePassenger, isPending }
}
