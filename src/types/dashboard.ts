import { ApiResponse } from "./api-response"

export interface DashboardData {
  totalEmployees: number
  activeEmployees: number
  totalOpenings: number
  openOpenings: number
  totalMatches: number
  totalTickets: number
  recentMatches: {
    id: string
    matchedAt: Date
    employee: {
      firstName: string
      lastName: string
      position: string
    }
    opening: {
      title: string
      department: string
    }
  }[]
  recentEmployees: {
    id: string
    firstName: string
    lastName: string
    department: string
    position: string
    isActive: boolean
    createdAt: Date
  }[]
}

export type DashboardDataResponse = ApiResponse<DashboardData>
