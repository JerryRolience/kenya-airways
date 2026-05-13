"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { buildPaginatedResult } from "@/actions/lib/pagination"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { FetchMatchesInput, FetchMatchesSchema } from "@/validators/match"
import { MatchListItem, FetchMatchesResponse } from "@/types/match"
import { Prisma } from "../../../../../generated/prisma/browser"

export async function fetchMatches(input: FetchMatchesInput = { limit: 10 }): Promise<FetchMatchesResponse> {
  try {
    // 1. Validate input
    const validated = FetchMatchesSchema.parse(input)
    const { cursor, limit, search, employeeId, openingId, department, isActive, isOpeningOpen } = validated

    // 2. Authentication
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view matches.",
      })
    }

    if (!res.data.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. Only administrators can view employee matches.",
      })
    }

    // 3. Build where clause
    const searchFilter: Prisma.EmployeeAssignmentWhereInput = search
      ? {
          OR: [
            {
              employee: {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                  { employeeNo: { contains: search, mode: "insensitive" } },
                  { department: { contains: search, mode: "insensitive" } },
                  { position: { contains: search, mode: "insensitive" } },
                ],
              },
            },
            {
              opening: {
                OR: [{ title: { contains: search, mode: "insensitive" } }, { department: { contains: search, mode: "insensitive" } }],
              },
            },
            { notes: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}

    const where: Prisma.EmployeeAssignmentWhereInput = {
      ...(employeeId && { employeeId }),
      ...(openingId && { openingId }),
      ...(department && {
        OR: [{ employee: { department } }, { opening: { department } }],
      }),
      ...(isActive !== undefined && {
        employee: { isActive },
      }),
      ...(isOpeningOpen !== undefined && {
        opening: { isOpen: isOpeningOpen },
      }),
      ...searchFilter,
    }

    const hasFilters = !!search || !!employeeId || !!openingId || !!department || isActive !== undefined || isOpeningOpen !== undefined

    // 4. Run count + fetch in parallel
    const [total, items] = await Promise.all([
      prisma.employeeAssignment.count({ where }),
      prisma.employeeAssignment.findMany({
        where,
        take: limit + 1,
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1,
        }),
        orderBy: [{ matchedAt: "desc" }, { id: "asc" }],
        select: {
          id: true,
          matchedAt: true,
          notes: true,
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              employeeNo: true,
              department: true,
              position: true,
              isActive: true,
            },
          },
          opening: {
            select: {
              id: true,
              title: true,
              department: true,
              isOpen: true,
            },
          },
        },
      }),
    ])

    // 5. Empty state — no matches at all
    if (total === 0 && !hasFilters) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: "No employee matches have been made yet.",
        data: buildPaginatedResult<MatchListItem>({
          items: [],
          total: 0,
          limit,
          isFiltered: false,
        }),
      })
    }

    // 6. Empty state — filters returned nothing
    if (total === 0) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: search
          ? `No matches found matching "${search}". Try a different employee name, position, or department.`
          : "No matches match the selected filters. Try adjusting your filtering criteria.",
        data: buildPaginatedResult<MatchListItem>({
          items: [],
          total: 0,
          limit,
          isFiltered: true,
          search,
        }),
      })
    }

    // 7. Map items
    const mappedItems: MatchListItem[] = items.slice(0, limit).map(match => ({
      id: match.id,
      matchedAt: match.matchedAt,
      notes: match.notes,
      employee: match.employee,
      opening: match.opening,
      employeeName: `${match.employee.firstName} ${match.employee.lastName}`,
      openingTitle: match.opening.title,
    }))

    // 8. Build paginated result
    const paginated = buildPaginatedResult<MatchListItem>({
      items: mappedItems,
      total,
      limit,
      isFiltered: hasFilters,
      search,
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: hasFilters ? `Found ${total} match${total === 1 ? "" : "es"} matching your search.` : `Showing ${paginated.data.length} of ${total} match${total === 1 ? "" : "es"}.`,
      data: paginated,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching matches.",
    })
  }
}
