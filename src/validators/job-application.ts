import { z } from "zod"
import { JobApplicationInputData } from "@/types/job-application"

export const JobApplicationSchema: z.ZodType<JobApplicationInputData> = z.object({
  openingId: z.string().min(1, "Opening ID is required."),
  coverLetter: z.string().trim().min(50, "Cover letter must be at least 50 characters long.").max(3000, "Cover letter must not exceed 3000 characters."),
  cvUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal("")),
})
