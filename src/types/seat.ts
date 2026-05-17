import { SeatPosition } from "../../generated/prisma/enums"

export interface SeatData {
  id: string
  seatNumber: string
  row: number
  column: string
  position: SeatPosition
  isBooked: boolean
  isBlocked: boolean
  isSelected?: boolean // Client-side selection state
}

export interface SeatClassGroup {
  class: string // EXECUTIVE, MIDDLE, ECONOMY
  rows: number[]
  seats: SeatData[]
}

export interface FlightSeatMap {
  flightId: string
  flightNumber: string
  aircraftType: string
  classes: SeatClassGroup[]
}
