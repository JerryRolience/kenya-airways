"use client"

import { cancelBooking } from "@/actions/bookings/cancel"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseCancelBookingParams {
  onSuccess?: () => void
}

export function useCancelBooking({ onSuccess }: UseCancelBookingParams) {
  const queryClient = useQueryClient()

  const { mutate: onCancelBooking, isPending } = useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) => cancelBooking({ bookingId, reason }),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({ title: "Booking cancelled successfully", description: res.message, action: "success" })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["bookings"] })
        queryClient.invalidateQueries({ queryKey: ["booking-stats"] })
        queryClient.invalidateQueries({ queryKey: ["available-bookings"] })
        queryClient.invalidateQueries({ queryKey: ["available-openings"] })
        onSuccess?.()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: "Failed to cancel booking",
          description: res.message ?? "Something went wrong. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong. Please try again."

      ErrorHandler({ title: "Failed to cancel booking", description, action: "error" })
    },
  })

  return { onCancelBooking, isPending }
}
