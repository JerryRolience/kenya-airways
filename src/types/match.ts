import { ApiResponse } from "./api-response"
import { PaginatedResult } from "./pagination"

export interface MatchEmployeeInputData {
  employeeId: string
  openingId: string
  notes?: string
}

export interface MatchListItem {
  id: string
  matchedAt: Date
  notes: string | null
  employee: {
    id: string
    firstName: string
    lastName: string
    employeeNo: string
    department: string
    position: string
    isActive: boolean
  }
  opening: {
    id: string
    title: string
    department: string
    isOpen: boolean
  }
  employeeName: string
  openingTitle: string
}

export interface MatchStats {
  totalMatches: number
  newThisMonth: number
  newLastMonth: number
  newMatchChange: number
  activeMatches: number
  closedMatches: number
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
  departmentsWithMatches: number
}

export interface AvailableEmployeeOption {
  value: string // employeeId
  label: string // employee name (position)
}

export interface MatchReportItem {
  id: string
  matchedAt: Date
  employeeName: string
  employeeNo: string
  employeeDepartment: string
  employeePosition: string
  openingTitle: string
  openingDepartment: string
  openingStatus: string
  notes: string | null
}

export interface MatchReportData {
  matches: MatchReportItem[]
  totalMatches: number
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
}

export type MatchStatsResponse = ApiResponse<MatchStats>
export type FetchMatchesResponse = ApiResponse<PaginatedResult<MatchListItem>>
export type AvailableEmployeesResponse = ApiResponse<AvailableEmployeeOption[]>
export type MatchReportResponse = ApiResponse<MatchReportData>
