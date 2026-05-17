import { ApiResponse } from "./api-response"

export interface PassengerProfileData {
  id: string
  title: string | null
  passportNumber: string | null
  nationality: string | null
  dateOfBirth: Date | null
}

export interface EmployeeProfileData {
  id: string
  employeeNo: string
  department: string
  position: string
  isActive: boolean
}

export interface ProfileData {
  id: string
  clerkId: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  role: string
  isActive: boolean
  createdAt: Date
  // Passenger profile
  passenger: PassengerProfileData | null
  // Employee profile
  employee: EmployeeProfileData | null
  // Stats
  totalBookings: number
  totalApplications: number
  totalPayments: number
}

export type ProfileResponse = ApiResponse<ProfileData>
