"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { TripTypeOptions } from "@/types/flights"
import { FlightSearchParamsSchema } from "@/validators/flights"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { ClassType } from "../../../generated/prisma/enums"
import { customZodResolver } from "../custom-zod-resolver"

export function useSearchFlight() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FlightSearchParamsSchema>>({
    resolver: customZodResolver(FlightSearchParamsSchema),
    defaultValues: {
      from: "",
      to: "",
      date: new Date(),
      returnDate: undefined,
      tripType: TripTypeOptions[0],
      class: ClassType.ECONOMY,
      passengers: 1,
    },
  })

  const onSubmit = form.handleSubmit(data => {
    // Client-side validation
    if (data.from === data.to) {
      ErrorHandler({
        title: "Invalid Airport Selection",
        description: "Origin and destination must be different.",
        action: "error",
      })
      return
    }

    if (data.tripType === TripTypeOptions[1] && data.returnDate && data.returnDate <= data.date) {
      ErrorHandler({
        title: "Invalid Date Selection",
        description: "Return date must be after departure date.",
        action: "error",
      })
      return
    }

    setLoading(true)

    // Build URL params and navigate
    const params = new URLSearchParams({
      from: data.from,
      to: data.to,
      date: format(data.date, "yyyy-MM-dd"),
      class: data.class,
      passengers: String(data.passengers),
      tripType: data.tripType,
      ...(data.returnDate && data.tripType === TripTypeOptions[1] ? { returnDate: format(data.returnDate, "yyyy-MM-dd") } : {}),
    })

    router.push(`/flights?${params.toString()}`)
  })

  return {
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    setValue: form.setValue,
    watch: form.watch,
    onSubmit,
    isPending: loading,
  }
}
