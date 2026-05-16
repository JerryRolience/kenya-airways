"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { HttpError } from "@/lib"
import { MatchEmployeeInputData } from "@/types/match"
import { MatchEmployeeSchema } from "@/validators/match"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import z from "zod"
import { customZodResolver } from "../custom-zod-resolver"
import { useEffect, useMemo } from "react"
import { useFetchAvailableOpenings } from "../job/use-fetch-available-openings"
import { useFetchAvailableEmployees } from "../employee/use-fetch-available-employees"
import { matchEmployeeToOpening } from "@/actions/job/match/matching-employee-to-job-opening"

export function useAddMatchForm(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof MatchEmployeeSchema>>({
    resolver: customZodResolver(MatchEmployeeSchema),
    defaultValues: {
      openingId: "",
      employeeId: "",
      notes: "",
    },
  })

  const selectedOpeningId = form.watch("openingId")

  // Fetch available openings
  const { data: openingsData, isLoading: openingsLoading } = useFetchAvailableOpenings()

  const openings = useMemo(() => {
    return openingsData?.data ?? []
  }, [openingsData])

  // Fetch available employees based on selected opening
  const { data: employeesData, isLoading: employeesLoading } = useFetchAvailableEmployees({
    openingId: selectedOpeningId || null,
    enabled: !!selectedOpeningId,
  })

  const employees = useMemo(() => {
    return employeesData?.data ?? []
  }, [employeesData])

  // Opening options
  const openingOptions = useMemo(() => openings.map(o => ({ value: o.value, label: o.label })), [openings])

  // Employee options
  const employeeOptions = useMemo(() => employees.map(e => ({ value: e.value, label: e.label })), [employees])

  // Reset employee when opening changes
  useEffect(() => {
    if (selectedOpeningId) {
      form.setValue("employeeId", "")
    }
  }, [selectedOpeningId, form])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MatchEmployeeInputData) => matchEmployeeToOpening(data),

    onSuccess: res => {
      if (res.success) {
        ErrorHandler({
          title: "Match created successfully",
          description: res.message,
          action: "success",
        })
        queryClient.invalidateQueries({ queryKey: ["matches"] })
        queryClient.invalidateQueries({ queryKey: ["match-stats"] })
        queryClient.invalidateQueries({ queryKey: ["available-employees"] })
        queryClient.invalidateQueries({ queryKey: ["dashboard-data"] })
        onSuccess?.()
        form.reset()
      } else {
        ErrorHandler({
          title: "Failed to create match",
          description: res.message ?? "Something went wrong while creating the match. Please try again.",
          action: "error",
        })
      }
    },

    onError: error => {
      const description = error instanceof HttpError ? error.message : error instanceof Error ? error.message : "Something went wrong while creating the match. Please try again."

      ErrorHandler({ title: "Failed to create match", description, action: "error" })
    },
  })

  const onSubmit = form.handleSubmit(data => mutate(data as MatchEmployeeInputData))

  return {
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    watch: form.watch,
    setValue: form.setValue,
    reset: form.reset,
    onSubmit,
    isPending,
    openingOptions,
    employeeOptions,
    openingsLoading,
    employeesLoading,
    selectedOpeningId,
  }
}
