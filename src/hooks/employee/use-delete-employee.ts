"use client"

import { deleteEmployee } from "@/actions/employees/delete"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseDeleteEmployeeParams {
  employeeId: string
  onSuccess?: () => void
}

export function useDeleteEmployee({ employeeId, onSuccess }: UseDeleteEmployeeParams) {
  const queryClient = useQueryClient()

  const { mutate: onDeleteEmployee, isPending } = useMutation({
    mutationFn: () => deleteEmployee(employeeId),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({ title: "Employee deleted successfully", description: res.message, action: "success" })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["employees"] })
        queryClient.invalidateQueries({ queryKey: ["employee-stats"] })
        queryClient.invalidateQueries({ queryKey: ["employee-options"] })
        onSuccess?.()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: "Failed to delete employee",
          description: res.message ?? "Something went wrong. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong. Please try again."

      ErrorHandler({ title: "Failed to delete Employee", description, action: "error" })
    },
  })

  return { onDeleteEmployee, isPending }
}
