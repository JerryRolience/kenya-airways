"use client"

import { updateEmployee } from "@/actions/employees/update"
import { updatePassenger } from "@/actions/passengers/update"
import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { ProfileData } from "@/types/profile"
import { UpdateEmployeeSchema } from "@/validators/employee"
import { UpdatePassengerSchema } from "@/validators/passenger"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import { Title } from "../../../generated/prisma/enums"
import { customZodResolver } from "../custom-zod-resolver"

interface UseUpdateUserProfileParams {
  profile: ProfileData
  onSuccess?: () => void
}

export function useUpdateUserProfile({ profile, onSuccess }: UseUpdateUserProfileParams) {
  const queryClient = useQueryClient()

  // Employee-specific form
  const employeeForm = useForm<z.infer<typeof UpdateEmployeeSchema>>({
    resolver: customZodResolver(UpdateEmployeeSchema),
    defaultValues: {
      id: profile?.employee?.id ?? "",
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? "",
      email: profile?.email ?? "",
    },
  })

  // Passenger-specific form
  const passengerForm = useForm<z.infer<typeof UpdatePassengerSchema>>({
    resolver: customZodResolver(UpdatePassengerSchema),
    defaultValues: {
      id: profile?.passenger?.id ?? "",
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? "",
      email: profile?.email ?? "",
      title: (profile?.passenger?.title as Title) ?? undefined,
      passportNumber: profile?.passenger?.passportNumber ?? "",
      nationality: profile?.passenger?.nationality ?? "",
      dateOfBirth: profile?.passenger?.dateOfBirth ?? undefined,
    },
  })

  // Determine which form to use based on profile type
  const activeForm = profile?.employee ? employeeForm : profile?.passenger ? passengerForm : passengerForm

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => {
      if (profile?.employee) {
        return updateEmployee({ id: profile.employee.id, ...data })
      } else if (profile?.passenger) {
        return updatePassenger({ id: profile.passenger.id, ...data })
      }
      // Just return the profile update result
      return Promise.resolve({ success: true, message: "Profile updated." })
    },

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: "Profile updated successfully",
          description: res.message || "Your profile has been updated.",
          action: "success",
        })
        queryClient.invalidateQueries({ queryKey: ["user-profile"] })
        queryClient.invalidateQueries({ queryKey: ["employees"] })
        queryClient.invalidateQueries({ queryKey: ["passengers"] })

        if (profile?.employee) {
          employeeForm.reset()
        }
        if (profile?.passenger) {
          passengerForm.reset()
        }

        onSuccess?.()
      } else {
        ErrorHandler({
          title: "Failed to update profile",
          description: res.message ?? "Something went wrong. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong. Please try again."

      ErrorHandler({
        title: "Failed to update profile",
        description,
        action: "error",
      })
    },
  })

  const onSubmit = activeForm.handleSubmit(data => mutate(data as any))

  return {
    register: activeForm.register,
    control: activeForm.control,
    errors: activeForm.formState.errors,
    watch: activeForm.watch,
    setValue: activeForm.setValue,
    reset: activeForm.reset,
    onSubmit,
    isPending,
    isDirty: activeForm.formState.isDirty,
  }
}
