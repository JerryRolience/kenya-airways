import { AuthData, SignUpData } from "@/types/auth";
import { z, ZodType } from "zod";

export const NAME_REGEX = /^[A-Za-z\s'-]+$/;
export const PHONE_REGEX = /^\+?[0-9]{10,15}$/;

export const _SignUpSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters long." })
    .max(50)
    .regex(NAME_REGEX, {
      message:
        "First name can only contain letters, spaces, hyphens, or apostrophes.",
    }),

  lastName: z
    .string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .max(50)
    .regex(NAME_REGEX, {
      message:
        "Last name can only contain letters, spaces, hyphens, or apostrophes.",
    }),

  phone: z.string().trim().regex(PHONE_REGEX, {
    message: "Please enter a valid phone number.",
  }),
});

const _AuthSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address." }),
});

export const SignUpSchema: ZodType<SignUpData> = _SignUpSchema;
export const AuthSchema: ZodType<AuthData> = _AuthSchema;
