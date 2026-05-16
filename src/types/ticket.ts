import { ApiResponse } from "./api-response"

export interface TicketReportItem {
  id: string
  ticketNumber: string
  status: string
  issuedAt: Date
  passengerName: string
  passengerEmail: string
  flightNumber: string
  from: string
  to: string
  departureTime: Date
  seatNumber: string | null
  class: string
  priceKES: number
  bookingReference: string
  paymentStatus: string
}

export interface TicketReportData {
  tickets: TicketReportItem[]
  totalTickets: number
  totalRevenue: number
  byClass: {
    executive: number
    middle: number
    economy: number
  }
  byStatus: {
    active: number
    used: number
    cancelled: number
  }
}

export type TicketReportResponse = ApiResponse<TicketReportData>

export interface FetchTicketReportInput {
  search?: string
  flightNumber?: string
  class?: string
  status?: string
  fromDate?: string
  toDate?: string
}
