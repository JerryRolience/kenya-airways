"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { FetchJobOpeningResponse, JobOpeningListItem } from "@/types/job-opening"
import { FetchJobOpeningInput, FetchJobOpeningSchema } from "@/validators/job-opening"
import { Prisma } from "../../../../../generated/prisma/client"
import { buildPaginatedResult } from "@/actions/lib/pagination"

export async function fetchJobOpenings(input: FetchJobOpeningInput = { limit: 10 }): Promise<FetchJobOpeningResponse> {
  try {
    //  1. Validate input
    const validated = FetchJobOpeningSchema.parse(input)
    const { cursor, limit, search, isOpen } = validated

    //  2. Authentication
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({ statusCode: STATUS_CODES.UNAUTHORIZED, message: "Access denied. You must be authenticated to view job openings." })
    }

    //  3. Build where clause
    // Search across employeeNo, firstName, lastName, phone , email
    const searchFilter: Prisma.JobOpeningWhereInput = search
      ? {
          OR: [{ title: { contains: search, mode: "insensitive" } }, { department: { contains: search, mode: "insensitive" } }, { description: { contains: search, mode: "insensitive" } }],
        }
      : {}

    const where: Prisma.JobOpeningWhereInput = {
      ...(isOpen !== undefined && { isOpen }),
      ...searchFilter,
    }

    const isFiltered = !!search || isOpen !== undefined

    //  4. Run count + fetch in parallel
    // We fetch limit + 1 to detect if a next page exists
    // Count uses same where clause so total reflects filters
    const [total, items] = await Promise.all([
      prisma.jobOpening.count({ where }),
      prisma.jobOpening.findMany({
        where,
        take: limit + 1, // fetch one extra to detect next page
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1, // skip the cursor item itself
        }),
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: {
          id: true,
          title: true,
          department: true,
          description: true,
          isOpen: true,
          closedAt: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { applications: true } },
        },
      }),
    ])

    //  5. Empty state — no employees in system at all
    if (total === 0 && !search && !isFiltered) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: "No job openings have been posted in the system yet.",
        data: buildPaginatedResult<JobOpeningListItem>({ items: [], total: 0, limit, isFiltered, search }),
      })
    }

    //  6. Empty state — filters returned nothing
    if (total === 0) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: search
          ? `No job openings found matching "${search}". Try a different title, department, or description.`
          : "No job openings match the selected filters. Try adjusting your filtering criteria.",
        data: buildPaginatedResult<JobOpeningListItem>({ items: [], total: 0, limit, isFiltered, search }),
      })
    }

    //  7. Build paginated result
    const paginated = buildPaginatedResult<JobOpeningListItem>({
      items: items.map(job => {
        return { ...job, applicationsCount: job._count.applications }
      }),
      total,
      limit,
      isFiltered,
      search,
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: paginated.meta.isFiltered ? `Found ${total} employee${total === 1 ? "" : "s"} matching your search.` : `Showing ${paginated.data.length} of ${total} employee${total === 1 ? "" : "s"}.`,
      data: paginated,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error
    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching job openings. Please try again.",
    })
  }
}
