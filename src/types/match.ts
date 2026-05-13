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

export type FetchMatchesResponse = ApiResponse<PaginatedResult<MatchListItem>>
