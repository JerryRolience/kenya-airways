import { FlightSearchParams, TripTypeOptions } from "@/types/flights"
import z from "zod"
import { BookingStatus, ClassType } from "../../generated/prisma/enums"
import { CursorPaginationSchema } from "./pagination"

const _FlightSearchParamsSchema = z
  .object({
    from: z.string().trim().length(3, { message: "Please select a departure city." }),
    to: z.string().trim().length(3, { message: "Please select a destination city." }),
    date: z
      .preprocess(
        val => {
          if (typeof val === "string" || val instanceof Date) {
            return new Date(val)
          }
        },
        z.date({ error: () => ({ message: "Please enter a valid departure date." }) }),
      )
      .refine(
        date => {
          // Get today at midnight for comparison
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          return date >= today
        },
        { message: "Departure date cannot be in the past." },
      ),
    // .refine(
    //   date => {
    //     // Check it's not today (optional — remove if you want to allow today)
    //     const today = new Date()
    //     today.setHours(0, 0, 0, 0)
    //     return date.getTime() !== today.getTime()
    //   },
    //   { message: "Departure date cannot be today. Please select a future date." },
    // ),
    returnDate: z
      .preprocess(
        val => {
          if (typeof val === "string" || val instanceof Date) {
            return new Date(val)
          }
        },
        z.date({ error: () => ({ message: "Please enter a valid return date." }) }),
      )
      .refine(
        date => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          return date >= today
        },
        { message: "Return date cannot be in the past." },
      )
      .optional(),
    tripType: z.enum(TripTypeOptions, { message: "Please select a trip type." }),
    class: z.nativeEnum(ClassType, { message: "Please select a cabin class." }),
    passengers: z.preprocess(
      val => {
        if (typeof val === "string") {
          return parseInt(val, 10)
        }
        return val
      },
      z.number().min(1, { message: "Please select at least one passenger." }).max(9, { message: "Maximum 9 passengers per booking." }),
    ),
  })
  .refine(
    data => {
      if (data.tripType === "return") {
        return data.returnDate !== undefined && data.returnDate >= data.date
      }
      return true
    },
    {
      message: "Return date must be after departure date for return trips.",
      path: ["returnDate"],
    },
  )
  .refine(data => data.from !== data.to, {
    message: "Departure and destination cannot be the same.",
    path: ["to"],
  })

export const FetchUserFlightsSchema = CursorPaginationSchema.extend({
  status: z.union([z.nativeEnum(BookingStatus), z.array(z.nativeEnum(BookingStatus))]).optional(),
  classType: z.union([z.nativeEnum(ClassType), z.array(z.nativeEnum(ClassType))]).optional(),
  upcoming: z.boolean().optional(),
})

export const FlightSearchParamsSchema: z.ZodType<FlightSearchParams> = _FlightSearchParamsSchema
export type FetchUserFlightsInput = z.infer<typeof FetchUserFlightsSchema>
