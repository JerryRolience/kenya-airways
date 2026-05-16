import { PaymentMethod } from "../../generated/prisma/enums"
import { ApiResponse } from "./api-response"
import { PaginatedResult } from "./pagination"

export interface UserPayment {
  id: string
  amount: number
  method: PaymentMethod
  transactionRef: string | null
  paidAt: Date
  bookingReference: string
  bookingStatus: string
  flightNumber: string
  from: string
  to: string
  departureTime: Date
}

export type UserPaymentsResponse = ApiResponse<PaginatedResult<UserPayment>>
