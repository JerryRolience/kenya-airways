import { ApiResponse } from "./api-response"

export interface UserDashboardOverview {
  upcomingBookings: number
  totalBookings: number
  jobApplications: number
  activeApplications: number
  recentBookings: {
    id: string
    reference: string
    status: string
    createdAt: Date
    flightNumber: string
    from: string
    to: string
    departureTime: Date
    totalAmount: number
  }[]
  recentApplications: {
    id: string
    status: string
    createdAt: Date
    openingTitle: string
    openingDepartment: string
  }[]
}

export type UserDashboardOverviewResponse = ApiResponse<UserDashboardOverview>
