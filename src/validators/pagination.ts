import z from "zod"

export const CursorPaginationSchema = z.object({
  cursor: z.string().cuid().optional().nullable(),
  limit: z.number().int().min(1, { message: "Limit must be at least 1." }).max(100, { message: "Limit cannot exceed 100." }).default(10),
  search: z.string().trim().max(100).optional(),
})

export type CursorPaginationInput = z.infer<typeof CursorPaginationSchema>
