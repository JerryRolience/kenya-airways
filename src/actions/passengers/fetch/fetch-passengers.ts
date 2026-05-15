"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { buildPaginatedResult } from "@/actions/lib/pagination"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { Prisma } from "../../../../generated/prisma/client"
import { FetchPassengersInput, FetchPassengersSchema } from "@/validators/passenger"
import { PassengerListItem, FetchPassengersResponse } from "@/types/passenger"

export async function fetchPassengers(input: FetchPassengersInput = { limit: 10 }): Promise<FetchPassengersResponse> {
  try {
    // 1. Validate input
    const validated = FetchPassengersSchema.parse(input)
    const { cursor, limit, search, nationality, hasUserAccount } = validated

    // 2. Authentication — only admins can view all passengers
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view passengers.",
      })
    }

    // 3. Build where clause
    const searchFilter: Prisma.PassengerWhereInput = search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { passportNumber: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { nationality: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}

    const where: Prisma.PassengerWhereInput = {
      ...(nationality && { nationality: Array.isArray(nationality) ? { in: nationality } : { equals: nationality } }),
      ...(hasUserAccount !== undefined && {
        userId: hasUserAccount ? { not: null } : null,
      }),
      ...searchFilter,
    }

    const hasFilters = !!search || !!nationality || hasUserAccount !== undefined

    // 4. Run count + fetch in parallel
    const [total, items] = await Promise.all([
      prisma.passenger.count({ where }),
      prisma.passenger.findMany({
        where,
        take: limit + 1,
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1,
        }),
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: {
          id: true,
          userId: true,
          title: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          passportNumber: true,
          nationality: true,
          dateOfBirth: true,
          relationship: true,
          createdAt: true,
          updatedAt: true,
          user: { select: { id: true, email: true, role: true } },
          _count: { select: { bookingPassengers: true } },
        },
      }),
    ])

    // 5. Empty state — no passengers at all
    if (total === 0 && !hasFilters) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: "No passengers have been registered in the system yet.",
        data: buildPaginatedResult<PassengerListItem>({
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
          ? `No passengers found matching "${search}". Try a different name, email, passport number, or nationality.`
          : "No passengers match the selected filters. Try adjusting your filtering criteria.",
        data: buildPaginatedResult<PassengerListItem>({
          items: [],
          total: 0,
          limit,
          isFiltered: true,
          search,
        }),
      })
    }

    // 7. Map items
    const mappedItems: PassengerListItem[] = items.map(p => ({
      id: p.id,
      userId: p.userId,
      title: p.title,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      passportNumber: p.passportNumber,
      nationality: p.nationality,
      dateOfBirth: p.dateOfBirth,
      relationship: p.relationship,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      userEmail: p.user?.email || null,
      userRole: p.user?.role || null,
      bookingsCount: p._count.bookingPassengers,
    }))

    // 8. Build paginated result
    const paginated = buildPaginatedResult<PassengerListItem>({
      items: mappedItems,
      total,
      limit,
      isFiltered: hasFilters,
      search,
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: hasFilters ? `Found ${total} passenger${total === 1 ? "" : "s"} matching your search.` : `Showing ${paginated.data.length} of ${total} passenger${total === 1 ? "" : "s"}.`,
      data: paginated,
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching passengers.",
    })
  }
}
