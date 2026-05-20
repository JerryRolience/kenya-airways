import { ClassType } from "../../../../generated/prisma/enums"

//  Booking context derived from URL params
export interface BookingContext {
  // Outbound
  outboundFlightId: string
  outboundNumber: string
  outboundDep: Date
  outboundArr: Date
  outboundFrom: string
  outboundTo: string
  outboundFromCity: string
  outboundToCity: string
  outboundPrice: number

  // Return (optional)
  returnFlightId?: string
  returnNumber?: string
  returnDep?: Date
  returnArr?: Date
  returnFrom?: string
  returnTo?: string
  returnFromCity?: string
  returnToCity?: string
  returnPrice?: number

  isReturnTrip: boolean
  classType: ClassType
  passengerCount: number
}
