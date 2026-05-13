"use client"

import { updateEmployee } from "@/actions/employees/update"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { EmployeeListItem } from "@/types/employee"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface UseToggleEmployeeStatusParams {
  employee: EmployeeListItem
  onSuccess?: () => void
}
export function useToggleEmployeeStatus({ employee, onSuccess }: UseToggleEmployeeStatusParams) {
  const queryClient = useQueryClient()

  const { mutate: onToggleEmployeeStatus, isPending } = useMutation({
    mutationFn: () => updateEmployee({ id: employee.id, isActive: !employee.isActive }),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: `Employee ${employee.isActive ? "deactivated" : "activated"} successfully`,
          description: res.message,
          action: "success",
        })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["employees"] })
        queryClient.invalidateQueries({ queryKey: ["employee-stats"] })
        queryClient.invalidateQueries({ queryKey: ["employee-options"] })
        onSuccess?.()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: `Failed to ${employee.isActive ? "deactivate" : "activate"} employee`,
          description: res.message ?? `Something went wrong while ${employee.isActive ? "deactivating" : "activating"} the employee. Please try again.`,
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description =
        error instanceof HttpError
          ? error.message
          : error instanceof Error
            ? error.message
            : `Something went wrong while ${employee.isActive ? "deactivating" : "activating"} the employee. Please try again.`

      ErrorHandler({ title: `Failed to ${employee.isActive ? "deactivate" : "activate"} employee`, description, action: "error" })
    },
  })

  return { onToggleEmployeeStatus, isPending }
}
