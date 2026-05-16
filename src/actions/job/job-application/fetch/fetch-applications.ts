"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { buildPaginatedResult } from "@/actions/lib/pagination"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApplicationListItem, FetchApplicationsResponse } from "@/types/job-application"
import { FetchApplicationsInput, FetchApplicationsSchema } from "@/validators/job-application"
import { Prisma } from "../../../../../generated/prisma/client"

export async function fetchApplications(input: FetchApplicationsInput = { limit: 10 }): Promise<FetchApplicationsResponse> {
  try {
    const validated = FetchApplicationsSchema.parse(input)
    const { cursor, limit, search, status, openingId, userId } = validated

    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You must be authenticated to view applications.",
      })
    }

    // Determine whose applications to fetch
    // If userId is provided (admin viewing specific user), use that
    // If no userId and is admin, fetch all (admin view)
    // If no userId and not admin, fetch own applications (user dashboard)
    const isAdmin = res.data.isAdmin
    const targetUserId = userId || (!isAdmin ? res.data.user.id : undefined)

    const searchFilter: Prisma.JobApplicationWhereInput = search
      ? {
          OR: [
            { user: { firstName: { contains: search, mode: "insensitive" } } },
            { user: { lastName: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { opening: { title: { contains: search, mode: "insensitive" } } },
            { opening: { department: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {}

    const where: Prisma.JobApplicationWhereInput = {
      ...(targetUserId && { userId: targetUserId }),
      ...(status && { status: Array.isArray(status) ? { in: status } : status }),
      ...(openingId && { openingId: Array.isArray(openingId) ? { in: openingId } : openingId }),
      ...searchFilter,
    }

    const isFiltered = !!search || !!status || !!openingId

    const [total, items] = await Promise.all([
      prisma.jobApplication.count({ where }),
      prisma.jobApplication.findMany({
        where,
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: {
          id: true,
          userId: true,
          openingId: true,
          coverLetter: true,
          cvUrl: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          opening: {
            select: {
              title: true,
              department: true,
              isOpen: true,
            },
          },
        },
      }),
    ])

    if (total === 0) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: targetUserId ? "You haven't submitted any applications yet." : "No applications found.",
        data: buildPaginatedResult<ApplicationListItem>({
          items: [],
          total: 0,
          limit,
          isFiltered,
          search,
        }),
      })
    }

    const mappedItems: ApplicationListItem[] = items.slice(0, limit).map(app => ({
      id: app.id,
      userId: app.userId,
      openingId: app.openingId,
      coverLetter: app.coverLetter,
      cvUrl: app.cvUrl,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      applicantName: `${app.user.firstName} ${app.user.lastName}`,
      applicantEmail: app.user.email,
      applicantPhone: app.user.phone,
      openingTitle: app.opening.title,
      openingDepartment: app.opening.department,
      openingIsOpen: app.opening.isOpen,
    }))

    const paginated = buildPaginatedResult<ApplicationListItem>({
      items: mappedItems,
      total,
      limit,
      isFiltered,
      search,
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: targetUserId ? `Found ${total} application${total === 1 ? "" : "s"}.` : `Found ${total} application${total === 1 ? "" : "s"} across all users.`,
      data: paginated,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching applications.",
    })
  }
}
