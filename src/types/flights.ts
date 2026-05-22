import { ClassType, FlightStatus } from "../../generated/prisma/enums"
import { ApiResponse } from "./api-response"
import { PaginatedResult } from "./pagination"

export type TripType = "one-way" | "return"
export const TripTypeOptions = ["one-way", "return"] as const

//  Search Params (from URL)
export interface FlightSearchParams {
  from: string
  to: string
  date: Date
  returnDate?: Date
  tripType: TripType
  class: ClassType
  passengers: number
}

//  Airport info returned in search results
export interface AirportInfo {
  id: string
  code: string
  name: string
  city: string
  country: string
  label: string // e.g. "Nairobi (NBO)"
}

//  Seat Class Availability
export interface SeatClassAvailability {
  id: string
  class: ClassType
  totalSeats: number
  bookedSeats: number
  availableSeats: number
  priceKES: number
  isFull: boolean
  hasEnoughSeats: boolean
}

//  Flight Result
export interface FlightSearchResult {
  id: string
  flightNumber: string
  departure: AirportInfo
  arrival: AirportInfo
  departureTime: Date
  arrivalTime: Date
  duration: number // In minutes
  status: FlightStatus
  seatClasses: SeatClassAvailability[]
  isDirect: boolean
  stopsCount: number
}

//  Next Available
export interface NextAvailableFlight {
  date: Date
  availableSeats: number
  priceKES: number
  flightId: string
  flightNumber: string
}

//  Search Filters (for the filter sidebar)
export interface FlightSearchFilters {
  maxPrice?: number
  minPrice?: number
  departureTimeRange?: {
    morning: boolean // 06:00 - 11:59
    afternoon: boolean // 12:00 - 17:59
    evening: boolean // 18:00 - 23:59
  }
  directOnly: boolean
  airlines?: string[]
  sortBy: "price" | "duration" | "departureTime"
  sortOrder: "asc" | "desc"
}

//  Main Search Response
export interface FlightSearchResponse {
  searchParams: FlightSearchParams
  outboundFlights: FlightSearchResult[]
  returnFlights: FlightSearchResult[]
  nextAvailable: NextAvailableFlight | null
  nextAvailableReturn: NextAvailableFlight | null
  isNoOutboundRoute: boolean // Indicates if there are no outbound flights at all (used to show specific messaging in UI) and all outbound flights are full or non-existent
  isNoReturnRoute: boolean // Indicates if there are no return flights at all (used to show specific messaging)
  isAllFull: boolean
  totalResults: number
  cheapestPrice: number | null
  filters: {
    airlines: string[]
    priceRange: {
      min: number
      max: number
    }
  }
}

export interface AvailableFlightOption {
  value: string // flightId
  label: string // flightNumber - departureTime (from → to)
  seatClassId: string // The seat class ID for the selected class
  priceKES: number
  availableSeats: number
  departureTime: Date
}

export interface UserFlight {
  id: string
  bookingId: string
  bookingReference: string
  bookingStatus: string
  flightNumber: string
  from: string
  fromCity: string
  to: string
  toCity: string
  departureTime: Date
  arrivalTime: Date
  classType: string
  passengerCount: number
  totalAmount: number
  paymentStatus: string
  isReturnTrip: boolean
}

export type UserFlightsResponse = ApiResponse<PaginatedResult<UserFlight>>
