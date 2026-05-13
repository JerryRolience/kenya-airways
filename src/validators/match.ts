import { z } from "zod"
import { MatchEmployeeInputData } from "@/types/match"
import { CursorPaginationSchema } from "./pagination"

export const MatchEmployeeSchema: z.ZodType<MatchEmployeeInputData> = z.object({
  employeeId: z.string().min(1, "Please select an employee."),
  openingId: z.string().min(1, "Please select a job opening."),
  notes: z.string().max(500, "Notes must not exceed 500 characters.").optional(),
})

export const FetchMatchesSchema = CursorPaginationSchema.extend({
  employeeId: z.string().optional(),
  openingId: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional(),
  isOpeningOpen: z.boolean().optional(),
})

export type FetchMatchesInput = z.infer<typeof FetchMatchesSchema>
