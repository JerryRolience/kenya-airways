import { z } from "zod"
import { CursorPaginationSchema } from "./pagination"
import { UpdatePassengerInputData } from "@/types/passenger"
import { NAME_REGEX, PHONE_REGEX } from "./auth"
import { PassengerRelation, Title } from "../../generated/prisma/enums"

export const UpdatePassengerSchema: z.ZodType<UpdatePassengerInputData> = z.object({
  id: z.string().min(1, "Passenger ID is required."),
  title: z.nativeEnum(Title).optional(),
  firstName: z.string().trim().min(2, "First name must be at least 2 characters.").max(50).regex(NAME_REGEX, "First name contains invalid characters.").optional(),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters.").max(50).regex(NAME_REGEX, "Last name contains invalid characters.").optional(),
  email: z.string().email("Please enter a valid email.").optional(),
  phone: z.string().trim().regex(PHONE_REGEX, "Please enter a valid phone number.").optional(),
  passportNumber: z.string().trim().min(5, "Passport number must be at least 5 characters.").optional(),
  nationality: z.string().trim().min(2, "Nationality is required.").optional(),
  dateOfBirth: z.date().optional(),
  relationship: z.nativeEnum(PassengerRelation).optional(),
})

export const FetchPassengersSchema = CursorPaginationSchema.extend({
  nationality: z.string().optional(),
  hasUserAccount: z.boolean().optional(),
})

export type FetchPassengersInput = z.infer<typeof FetchPassengersSchema>
