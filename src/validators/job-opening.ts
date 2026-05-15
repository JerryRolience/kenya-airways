import z from "zod"
import { CursorPaginationSchema } from "./pagination"
import { CreateJobOpeningInputData, UpdateJobOpeningInputData } from "@/types/job-opening"

export const _CreateJobOpeningSchema: z.ZodType<CreateJobOpeningInputData> = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters long.").max(100, "Title must not exceed 100 characters."),
  department: z.string().trim().min(2, "Department is required."),
  description: z.string().trim().min(20, "Description must be at least 20 characters long.").max(5000, "Description must not exceed 5000 characters."),
  isOpen: z.boolean().optional(),
})

export const _UpdateJobOpeningSchema: z.ZodType<UpdateJobOpeningInputData> = z.object({
  id: z.string().min(1, "Opening ID is required."),
  title: z.string().trim().min(5, "Title must be at least 5 characters long.").max(100, "Title must not exceed 100 characters.").optional(),
  department: z.string().trim().min(2, "Department is required.").optional(),
  description: z.string().trim().min(20, "Description must be at least 20 characters long.").max(5000, "Description must not exceed 5000 characters.").optional(),
  isOpen: z.boolean().optional(),
})

export const FetchJobOpeningSchema = CursorPaginationSchema.extend({
  isOpen: z.boolean().optional(),
})

export const CreateJobOpeningSchema: z.ZodType<CreateJobOpeningInputData> = _CreateJobOpeningSchema
export const UpdateJobOpeningSchema: z.ZodType<UpdateJobOpeningInputData> = _UpdateJobOpeningSchema
export type FetchJobOpeningInput = z.infer<typeof FetchJobOpeningSchema>
