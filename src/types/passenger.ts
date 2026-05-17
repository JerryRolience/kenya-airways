import { ApiResponse } from "./api-response"
import { PaginatedResult } from "./pagination"
import { PassengerRelation, Title, Role } from "../../generated/prisma/enums"
import { PassengerFormValues } from "@/validators/booking"

export interface UpdatePassengerInputData {
  id: string
  title?: Title
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  passportNumber?: string
  nationality?: string
  dateOfBirth?: Date
  relationship?: PassengerRelation
}

export interface PassengerListItem {
  id: string
  userId: string | null
  title: string | null
  firstName: string
  lastName: string
  email: string
  phone: string
  passportNumber: string | null
  nationality: string | null
  dateOfBirth: Date | null
  relationship: PassengerRelation
  createdAt: Date
  updatedAt: Date
  userEmail: string | null
  userRole: Role | null
  bookingsCount: number
}
export interface PassengerStats {
  totalPassengers: number
  registeredUsers: number
  guestPassengers: number
  newThisMonth: number
  newLastMonth: number
  newPassengerChange: number
  totalBookings: number
  byNationality: {
    totalNationalities: number
    kenyanPassengers: number
    otherPassengers: number
  }
}

export type PassengerStatsResponse = ApiResponse<PassengerStats>
export type FetchPassengersResponse = ApiResponse<PaginatedResult<PassengerListItem>>
export type FetchPassengerByIdResponse = ApiResponse<PassengerListItem>
export type PassengerProfileResponse = ApiResponse<Partial<PassengerFormValues>>
