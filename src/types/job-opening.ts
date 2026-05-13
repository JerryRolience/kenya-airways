import { ApiResponse } from "./api-response"
import { PaginatedResult } from "./pagination"

export interface CreateJobOpeningInputData {
  title: string
  department: string
  description: string
}

export interface UpdateJobOpeningInputData {
  id: string
  title?: string
  department?: string
  description?: string
  isOpen?: boolean
}

export interface JobOpeningListItem {
  id: string
  title: string
  department: string
  description: string
  isOpen: boolean
  closedAt: Date | null
  createdAt: Date
  updatedAt: Date
  applicationsCount: number
  assignmentsCount?: number
}

export type FetchJobOpeningResponse = ApiResponse<PaginatedResult<JobOpeningListItem>>
