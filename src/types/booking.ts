import { BookingStatus, ClassType, PassengerRelation, PaymentMethod, PaymentStatus, TicketStatus, Title } from "../../generated/prisma/enums"
import { ApiResponse } from "./api-response"
import { PaginatedResult } from "./pagination"

export interface PassengerInput {
  title: Title
  firstName: string
  lastName: string
  email: string
  phone: string
  passportNumber: string
  nationality: string
  dateOfBirth: Date
  relationship: PassengerRelation
}

export interface CreateBookingInput {
  // Flights
  outboundFlightId: string
  returnFlightId?: string // null for one-way
  isReturnTrip: boolean

  // Class — same class for both legs
  classType: ClassType

  // Passengers
  passengers: PassengerInput[]

  // Payment — simulated for now
  paymentMethod: PaymentMethod
  transactionRef?: string // M-Pesa code, card ref, etc.

  // Totals (pre-calculated on client, re-validated on server)
  totalAmount: number
}

export interface CreatedBookingResult {
  bookingId: string
  reference: string // KQ-2026-XXXXXX
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  ticketNumbers: string[] // TKT-XXXXXX per passenger
  outboundFlight: {
    flightNumber: string
    departureTime: Date
    from: string
    to: string
  }
  returnFlight?: {
    flightNumber: string
    departureTime: Date
    from: string
    to: string
  }
}

export interface BookingPassengerDetail {
  id: string
  title: Title | null
  firstName: string
  lastName: string
  email: string
  passportNumber: string
  nationality: string
  dateOfBirth: Date | null
  relationship: PassengerRelation
  seatNumber: string | null
  ticket: {
    id: string
    ticketNumber: string
    status: TicketStatus
    issuedAt: Date
  } | null
}

export interface BookingDetail {
  id: string
  reference: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  isReturnTrip: boolean
  createdAt: Date

  outboundFlight: {
    id: string
    flightNumber: string
    departureTime: Date
    arrivalTime: Date
    departure: { code: string; city: string; name: string }
    arrival: { code: string; city: string; name: string }
  }
  returnFlight?: {
    id: string
    flightNumber: string
    departureTime: Date
    arrivalTime: Date
    departure: { code: string; city: string; name: string }
    arrival: { code: string; city: string; name: string }
  }

  seatClass: {
    class: ClassType
    priceKES: number
  }

  passengers: BookingPassengerDetail[]

  payment?: {
    method: PaymentMethod
    transactionRef: string | null
    amount: number
    paidAt: Date
  }
}

export interface BookingListItem {
  id: string
  reference: string
  status: BookingStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  isReturnTrip: boolean
  createdAt: Date
  classType: ClassType
  passengerCount: number
  outboundFlight: {
    flightNumber: string
    departureTime: Date
    from: string // airport code
    to: string
    fromCity: string
    toCity: string
  }
  returnFlight?: {
    flightNumber: string
    departureTime: Date
  }
}

export type FetchBookingsResponse = ApiResponse<PaginatedResult<BookingListItem>>
