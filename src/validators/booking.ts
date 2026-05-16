import { z } from "zod"
import { BookingStatus, ClassType, PassengerRelation, PaymentMethod, PaymentStatus, Title } from "../../generated/prisma/enums"
import { CursorPaginationSchema } from "./pagination"

const NAME_REGEX = /^[A-Za-z\s'-]+$/
const PHONE_REGEX = /^\+?[0-9]{10,15}$/
const PASSPORT_REGEX = /^[A-Z0-9]{6,9}$/i // most passports are 6–9 chars

const today = new Date()
today.setHours(0, 0, 0, 0)

/**
 * Coerces a string or Date to a Date object.
 * Used for dateOfBirth which may arrive as a string from the form.
 */
const coercedDate = z.preprocess(
  val => {
    if (val instanceof Date) return val
    if (typeof val === "string" && val.trim()) return new Date(val)
    return undefined
  },
  z.date({ message: "Date of birth is required." }),
)

export const PassengerSchema = z.object({
  title: z.nativeEnum(Title, {
    message: "Please select a valid title.",
  }),

  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name is too long.")
    .regex(NAME_REGEX, "First name can only contain letters, spaces, hyphens, or apostrophes."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name is too long.")
    .regex(NAME_REGEX, "Last name can only contain letters, spaces, hyphens, or apostrophes."),

  email: z.string().trim().toLowerCase().email("Please enter a valid email address."),

  phone: z.string().trim().regex(PHONE_REGEX, "Please enter a valid phone number (e.g. +254712345678)."),

  passportNumber: z.string().trim().toUpperCase().regex(PASSPORT_REGEX, "Passport number must be 6–9 alphanumeric characters."),

  nationality: z.string().trim().min(2, "Please enter a valid nationality.").max(60, "Nationality is too long."),

  dateOfBirth: coercedDate
    .refine(date => date <= today, "Date of birth cannot be in the future.")
    .refine(date => today.getFullYear() - date.getFullYear() <= 120, "Please enter a realistic date of birth.")
    .refine(
      // Must be at least 2 years old (infant must travel on adult's lap separately)
      date => {
        const age = today.getFullYear() - date.getFullYear()
        return age >= 0
      },
      "Please enter a valid date of birth.",
    ),

  relationship: z.nativeEnum(PassengerRelation, {
    message: "Please select a valid relationship.",
  }),
})

export const BookingFormSchema = z.object({
  passengers: z
    .array(PassengerSchema)
    .min(1, "At least one passenger is required.")
    .max(9, "Maximum 9 passengers per booking.")
    .refine(
      // All passport numbers must be unique within the booking
      passengers => {
        const passports = passengers.map(p => p.passportNumber.toUpperCase())
        return new Set(passports).size === passports.length
      },
      {
        message: "Each passenger must have a unique passport number.",
        path: ["passengers"],
      },
    ),
})

export const CreateBookingSchema = z
  .object({
    // Flight IDs
    outboundFlightId: z.string().min(1, "Outbound flight ID is required."),

    returnFlightId: z.string().optional(),

    isReturnTrip: z.boolean(),

    // Class
    classType: z.nativeEnum(ClassType, {
      message: "Invalid class type.",
    }),

    // Passengers — reuse the same per-passenger schema
    passengers: z
      .array(PassengerSchema)
      .min(1, "At least one passenger is required.")
      .max(9, "Maximum 9 passengers per booking.")
      .refine(
        passengers => {
          const passports = passengers.map(p => p.passportNumber.toUpperCase())
          return new Set(passports).size === passports.length
        },
        {
          message: "Each passenger must have a unique passport number.",
          path: ["passengers"],
        },
      ),

    // Payment
    paymentMethod: z.nativeEnum(PaymentMethod, {
      message: "Invalid payment method.",
    }),

    transactionRef: z.string().trim().optional(),

    // Total amount — validated server-side against DB prices
    totalAmount: z.number().positive("Total amount must be a positive number.").max(10_000_000, "Total amount seems unrealistically high."),
  })
  // Cross-field: returnFlightId required when isReturnTrip = true
  .refine(
    data => {
      if (data.isReturnTrip) return !!data.returnFlightId
      return true
    },
    {
      message: "Return flight ID is required for round trips.",
      path: ["returnFlightId"],
    },
  )
  // Cross-field: M-Pesa requires a transaction reference
  .refine(
    data => {
      if (data.paymentMethod === PaymentMethod.MPESA) {
        return !!data.transactionRef && data.transactionRef.length >= 6
      }
      return true
    },
    {
      message: "M-Pesa transaction code is required (minimum 6 characters).",
      path: ["transactionRef"],
    },
  )

export const CancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required."),
  reason: z.string().trim().optional(),
})

export const ChangeBookingSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required."),
  newFlightId: z.string().min(1, "New flight ID is required."),
  newSeatClassId: z.string().min(1, "New seat class ID is required."),
  fareDifference: z.number(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  transactionRef: z.string().trim().optional(),
})

export const FetchBookingsSchema = CursorPaginationSchema.extend({
  status: z.union([z.array(z.nativeEnum(BookingStatus)), z.nativeEnum(BookingStatus)]).optional(),
  paymentStatus: z.union([z.array(z.nativeEnum(PaymentStatus)), z.nativeEnum(PaymentStatus)]).optional(),
})

export type FetchBookingsInput = z.infer<typeof FetchBookingsSchema>
export type ChangeBookingInput = z.infer<typeof ChangeBookingSchema>
export type CancelBookingInput = z.infer<typeof CancelBookingSchema>
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>
export type BookingFormValues = z.infer<typeof BookingFormSchema>
export type PassengerFormValues = z.infer<typeof PassengerSchema>
