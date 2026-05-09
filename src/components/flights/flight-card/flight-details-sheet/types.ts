import { FlightSearchParams, FlightSearchResult } from "@/types/flights"

export interface FlightDetailsSheetProps {
  flight: FlightSearchResult
  searchParams: FlightSearchParams
  children: React.ReactNode
}

//  Class-specific amenity definitions
export interface Amenity {
  icon: React.ElementType
  label: string
  included: boolean
  note?: string
}

export interface BaggageAllowance {
  type: string
  cabin: string
  checked: string
  icon: React.ElementType
}
