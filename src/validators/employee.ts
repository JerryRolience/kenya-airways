import { z } from "zod"
import { CursorPaginationSchema } from "./pagination"
import { CreateEmployeeInputData, UpdateEmployeeInputData } from "@/types/employee"
import { NAME_REGEX, PHONE_REGEX } from "./auth"
import { Role } from "../../generated/prisma/enums"

const _CreateEmployeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters long." })
    .max(50)
    .regex(NAME_REGEX, {
      message: "First name can only contain letters, spaces, hyphens, or apostrophes.",
    })
    .optional(),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters long." })
    .max(50)
    .regex(NAME_REGEX, {
      message: "Last name can only contain letters, spaces, hyphens, or apostrophes.",
    })
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(PHONE_REGEX, {
      message: "Please enter a valid phone number.",
    })
    .optional(),
  email: z.string().email("Please enter a valid email address"),
  role: z.nativeEnum(Role, {
    message: "Please select a valid role for the employee.",
  }),
  position: z.string().min(2, "Position must be at least 2 characters"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  isActive: z.boolean().optional(),
})

const _UpdateEmployeeSchema = _CreateEmployeeSchema.partial().extend({
  id: z.string().cuid(),
})

export const FetchEmployeesSchema = CursorPaginationSchema.extend({
  isActive: z.boolean().optional(),
})

export const CreateEmployeeSchema: z.ZodType<CreateEmployeeInputData> = _CreateEmployeeSchema
export const UpdateEmployeeSchema: z.ZodType<UpdateEmployeeInputData> = _UpdateEmployeeSchema
export type FetchEmployeesInput = z.infer<typeof FetchEmployeesSchema>
