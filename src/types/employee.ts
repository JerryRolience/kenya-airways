import { Role } from "../../generated/prisma/enums"
import { ApiResponse } from "./api-response"
import { PaginatedResult } from "./pagination"

export interface CreateEmployeeInputData {
  firstName?: string
  lastName?: string
  phone?: string
  email: string
  role: Role
  position: string
  department: string
  isActive?: boolean
}

export interface UpdateEmployeeInputData extends Partial<CreateEmployeeInputData> {
  id: string
}

export interface EmployeeListItem {
  id: string
  userId: string | null
  employeeNo: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  role?: Role
  position: string
  department: string
  isActive: boolean
  createdAt: Date
}

export interface EmployeeAnalytics {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  newThisMonth: number
  newLastMonth: number
}

export interface EmployeeStats {
  totalEmployees: number
  activeEmployees: number
  inactiveEmployees: number
  newThisMonth: number
  newLastMonth: number
  newEmployeeChange: number
  byDepartment: {
    flightOperations: number
    cabinCrew: number
    groundStaff: number
    engineering: number
    it: number
    humanResources: number
    finance: number
    marketing: number
    customerService: number
  }
  totalDepartments: number
}

export type EmployeeAnalyticsResponse = ApiResponse<EmployeeAnalytics>

export type FetchEmployeesResponse = ApiResponse<PaginatedResult<EmployeeListItem>>
export type FetchEmployeeByIdResponse = ApiResponse<EmployeeListItem>
export type EmployeeStatsResponse = ApiResponse<EmployeeStats>
