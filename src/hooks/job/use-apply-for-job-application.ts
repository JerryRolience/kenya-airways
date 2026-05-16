"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { JobApplicationInputData } from "@/types/job-application"
import { JobApplicationSchema } from "@/validators/job-application"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import { customZodResolver } from "../custom-zod-resolver"
import { applyForJobOpening } from "@/actions/job/job-application/apply/apply-for-job-opening"

interface UseApplyForJobOpeningParams {
  openingId: string
  onSuccess?: () => void
}

export function useApplyForJobOpening({ openingId, onSuccess }: UseApplyForJobOpeningParams) {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof JobApplicationSchema>>({
    resolver: customZodResolver(JobApplicationSchema),
    defaultValues: {
      openingId: openingId,
      coverLetter: "",
      cvUrl: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: JobApplicationInputData) => applyForJobOpening(data),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: "Application submitted!",
          description: res.message,
          action: "success",
        })
        queryClient.invalidateQueries({ queryKey: ["public-job-openings"] })
        queryClient.invalidateQueries({ queryKey: ["admin-job-openings"] })
        queryClient.invalidateQueries({ queryKey: ["job-opening-stats"] })
        queryClient.invalidateQueries({ queryKey: ["user-applications"] })
        onSuccess?.()
        form.reset()
      } else {
        ErrorHandler({
          title: "Failed to submit application",
          description: res.message ?? "Something went wrong while submitting your application. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong while submitting your application. Please try again."

      ErrorHandler({
        title: "Failed to submit application",
        description,
        action: "error",
      })
    },
  })

  const onSubmit = form.handleSubmit(data => mutate(data as JobApplicationInputData))

  return {
    register: form.register,
    errors: form.formState.errors,
    watch: form.watch,
    reset: form.reset,
    onSubmit,
    isPending,
    isSubmitted: form.formState.isSubmitSuccessful,
  }
}
