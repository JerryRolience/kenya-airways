import { ApplicationStatus } from "../../generated/prisma/enums"
import { ApiResponse } from "./api-response"
import { PaginatedResult } from "./pagination"

export interface JobApplicationInputData {
  openingId: string
  coverLetter: string
  cvUrl?: string
}

export interface ApplicationListItem {
  id: string
  userId: string
  openingId: string
  coverLetter: string
  cvUrl: string | null
  status: ApplicationStatus
  createdAt: Date
  updatedAt: Date
  applicantName: string
  applicantEmail: string
  applicantPhone: string | null
  openingTitle: string
  openingDepartment: string
  openingIsOpen: boolean
}

export type FetchApplicationsResponse = ApiResponse<PaginatedResult<ApplicationListItem>>
