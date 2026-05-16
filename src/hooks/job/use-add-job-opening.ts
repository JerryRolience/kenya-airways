"use client"

import { createJobOpening } from "@/actions/job/job-opening/create"
import { updateJobOpening } from "@/actions/job/job-opening/update"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { CreateJobOpeningInputData, JobOpeningListItem } from "@/types/job-opening"
import { CreateJobOpeningSchema } from "@/validators/job-opening"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import { customZodResolver } from "../custom-zod-resolver"

export function useAddJobOpening(onSuccess?: () => void, opening?: JobOpeningListItem) {
  const queryClient = useQueryClient()
  const isEditing = !!opening

  const form = useForm<z.infer<typeof CreateJobOpeningSchema>>({
    resolver: customZodResolver(CreateJobOpeningSchema),
    defaultValues: {
      title: opening?.title ?? undefined,
      department: opening?.department ?? undefined,
      description: opening?.description ?? undefined,
      isOpen: opening?.isOpen ?? true,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateJobOpeningInputData) => (isEditing ? updateJobOpening({ id: opening.id, ...data }) : createJobOpening(data)),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: isEditing ? "Job opening updated successfully" : "Job opening created successfully",
          description: res.message,
          action: "success",
        })
        // Invalidate first, then close — avoids stale data flash
        queryClient.invalidateQueries({ queryKey: ["public-job-openings"] })
        queryClient.invalidateQueries({ queryKey: ["admin-job-openings"] })
        queryClient.invalidateQueries({ queryKey: ["job-opening-stats"] })
        queryClient.invalidateQueries({ queryKey: ["available-openings"] })
        onSuccess?.()
        form.reset()
      } else {
        // Server returned success: false — operational error (validation, conflict, etc.)
        ErrorHandler({
          title: isEditing ? "Failed to update job opening" : "Failed to create job opening",
          description: res.message ?? `Something went wrong while ${isEditing ? "updating" : "creating"} the job opening. Please try again.`,
          action: "error",
        })
      }
    },

    onError: error => {
      // Network failure, thrown HttpError, or unexpected crash
      const description =
        error instanceof HttpError ? error.message : error instanceof Error ? error.message : `Something went wrong while ${isEditing ? "updating" : "creating"} the job opening. Please try again.`

      ErrorHandler({ title: isEditing ? "Failed to update job opening" : "Failed to create job opening", description, action: "error" })
    },
  })

  const onSubmit = form.handleSubmit(data => mutate(data as CreateJobOpeningInputData))

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
