import { AuthData, PassengerSignUpData, SignUpPassengerData } from "@/types/auth"
import { z, ZodType } from "zod"
import { Title } from "../../generated/prisma/enums"

export const NAME_REGEX = /^[A-Za-z\s'-]+$/
export const PHONE_REGEX = /^\+?[0-9]{10,15}$/

const today = new Date()

export const _PassengerSignUpSchema = z.object({
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters long." }).max(50).regex(NAME_REGEX, {
    message: "First name can only contain letters, spaces, hyphens, or apostrophes.",
  }),

  lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters long." }).max(50).regex(NAME_REGEX, {
    message: "Last name can only contain letters, spaces, hyphens, or apostrophes.",
  }),

  phone: z.string().trim().regex(PHONE_REGEX, {
    message: "Please enter a valid phone number.",
  }),

  title: z.nativeEnum(Title, {
    message: "Please select a valid title.",
  }),

  passportNumber: z.string().trim().min(5, {
    message: "Passport number must be at least 5 characters long.",
  }),

  nationality: z.string().trim().min(2, {
    message: "Nationality must be at least 2 characters long.",
  }),

  dateOfBirth: z
    .preprocess(
      val => {
        if (typeof val === "string" || val instanceof Date) {
          return new Date(val)
        }
      },
      z.date({ error: () => ({ message: "Date of birth is required." }) }),
    )
    .refine(date => date <= today, {
      message: "Date of birth cannot be in the future.",
    })
    .refine(date => today.getFullYear() - date.getFullYear() <= 120, {
      message: "Please enter a realistic date of birth.",
    }),
})

const SignUpDataSchema = _PassengerSignUpSchema.extend({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address." }),
})

const _AuthSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Please enter a valid email address." }),
})

export const PassengerSignUpSchema: ZodType<PassengerSignUpData> = _PassengerSignUpSchema
export const SignUpPassengerSchema: ZodType<SignUpPassengerData> = SignUpDataSchema
export const AuthSchema: ZodType<AuthData> = _AuthSchema
