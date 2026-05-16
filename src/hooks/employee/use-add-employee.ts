"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { CreateEmployeeInputData, EmployeeListItem } from "@/types/employee"
import { CreateEmployeeSchema } from "@/validators/employee"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import { customZodResolver } from "../custom-zod-resolver"
import { createEmployee } from "@/actions/employees/create"
import { updateEmployee } from "@/actions/employees/update"

export function useAddEmployee(onSuccess?: () => void, employee?: EmployeeListItem) {
  const queryClient = useQueryClient()
  const isEditing = !!employee

  const form = useForm<z.infer<typeof CreateEmployeeSchema>>({
    resolver: customZodResolver(CreateEmployeeSchema),
    defaultValues: {
      firstName: employee?.firstName ?? undefined,
      lastName: employee?.lastName ?? undefined,
      phone: employee?.phone ?? undefined,
      email: employee?.email ?? "",
      role: employee?.role ?? undefined,
      position: employee?.position ?? "",
      department: employee?.department ?? "",
      isActive: employee?.isActive ?? true,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateEmployeeInputData) => (isEditing ? updateEmployee({ id: employee.id, ...data }) : createEmployee(data)),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: isEditing ? "Employee updated successfully" : "Employee registered successfully",
          description: res.message,
          action: "success",
        })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["employees"] })
        queryClient.invalidateQueries({ queryKey: ["employee-stats"] })
        queryClient.invalidateQueries({ queryKey: ["available-employees"] })
        onSuccess?.()
        form.reset()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: isEditing ? "Failed to update employee" : "Failed to register employee",
          description: res.message ?? `Something went wrong while ${isEditing ? "updating" : "registering"} the employee. Please try again.`,
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description =
        error instanceof HttpError ? error.message : error instanceof Error ? error.message : `Something went wrong while ${isEditing ? "updating" : "registering"} the employee. Please try again.`

      ErrorHandler({ title: isEditing ? "Failed to update employee" : "Failed to register employee", description, action: "error" })
    },
  })

  const onSubmit = form.handleSubmit(data => mutate(data as CreateEmployeeInputData))

  return {
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    watch: form.watch,
    setValue: form.setValue,
    reset: form.reset,
    onSubmit,
    isPending,
  }
}
