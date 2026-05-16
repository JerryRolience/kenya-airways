import { z } from "zod"
import { JobApplicationInputData } from "@/types/job-application"
import { CursorPaginationSchema } from "./pagination"
import { ApplicationStatus } from "../../generated/prisma/client"

export const JobApplicationSchema: z.ZodType<JobApplicationInputData> = z.object({
  openingId: z.string().min(1, "Opening ID is required."),
  coverLetter: z.string().trim().min(50, "Cover letter must be at least 50 characters long.").max(3000, "Cover letter must not exceed 3000 characters."),
  cvUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
})

export const FetchApplicationsSchema = CursorPaginationSchema.extend({
  status: z.union([z.nativeEnum(ApplicationStatus), z.array(z.nativeEnum(ApplicationStatus))]).optional(),
  openingId: z.union([z.cuid(), z.array(z.cuid())]).optional(),
})

export type FetchApplicationsInput = z.infer<typeof FetchApplicationsSchema>
