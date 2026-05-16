import z from "zod"
import { CursorPaginationSchema } from "./pagination"
import { PaymentMethod } from "../../generated/prisma/enums"

export const FetchUserPaymentsSchema = CursorPaginationSchema.extend({
  method: z.union([z.nativeEnum(PaymentMethod), z.array(z.nativeEnum(PaymentMethod))]).optional(),
})

export type FetchUserPaymentsInput = z.infer<typeof FetchUserPaymentsSchema>
