"use client"

import { hireApplicant } from "@/actions/job/job-application/hire/hire-applicants"
import { ErrorHandler } from "@/components/global/error-handler"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useHireApplicant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (applicationId: string) => hireApplicant(applicationId),
    onSuccess: res => {
      if (res.success) {
        ErrorHandler({ title: "Applicant hired successfully", description: res.message, action: "success" })
        queryClient.invalidateQueries({ queryKey: ["job-applications"] })
        queryClient.invalidateQueries({ queryKey: ["user-applications"] })
        queryClient.invalidateQueries({ queryKey: ["employees"] })
        queryClient.invalidateQueries({ queryKey: ["employee-stats"] })
        queryClient.invalidateQueries({ queryKey: ["matches"] })
        queryClient.invalidateQueries({ queryKey: ["match-stats"] })
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
      } else {
        ErrorHandler({ title: "Failed to hire applicant", description: res.message, action: "error" })
      }
    },
    onError: (error: any) => {
      ErrorHandler({ title: "Failed to hire applicant", description: error.message, action: "error" })
    },
  })
}
