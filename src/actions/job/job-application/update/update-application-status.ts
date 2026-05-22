"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { ApplicationStatus } from "../../../../../generated/prisma/enums"

interface UpdateStatusInput {
  applicationId: string
  status: ApplicationStatus
}

export async function updateApplicationStatus(data: UpdateStatusInput): Promise<ApiResponse> {
  try {
    const res = await isUserAuthenticated()

    if (!res.data?.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. Only admins can update application statuses.",
      })
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: data.applicationId },
      select: { id: true, status: true },
    })

    if (!application) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "Application not found. Please check the application details and try again.",
      })
    }

    if (application.status === data.status) {
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: `The application is already in the ${data.status.toLowerCase()} status.`,
      })
    }

    if (application.status === ApplicationStatus.REJECTED && data.status === ApplicationStatus.ACCEPTED) {
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "You cannot accept an application that has already been rejected. Please review the application details and try again.",
      })
    }

    if (application.status === ApplicationStatus.ACCEPTED && data.status === ApplicationStatus.REJECTED) {
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "You cannot reject an application that has already been accepted. Please review the application details and try again.",
      })
    }

    await prisma.jobApplication.update({
      where: { id: data.applicationId },
      data: { status: data.status },
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `Application status updated to ${data.status.toLowerCase()}.`,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while updating the application status.",
    })
  }
}
