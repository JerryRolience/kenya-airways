"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { buildPaginatedResult } from "@/actions/lib/pagination"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { Prisma } from "../../../../generated/prisma/client"
import { UserFlight, UserFlightsResponse } from "@/types/flights"
import { FetchUserFlightsInput } from "@/validators/flights"

export async function fetchUserFlights(input: FetchUserFlightsInput = { limit: 10 }): Promise<UserFlightsResponse> {
  try {
    const { cursor, limit = 10, search, status, upcoming, classType } = input

    // 1. Authentication
    const res = await isUserAuthenticated()

    if (!res.success || !res.data) {
      throw new HttpError({
        message: res.message || "Authentication failed.",
        statusCode: res.statusCode || STATUS_CODES.UNAUTHORIZED,
      })
    }

    const { user } = res.data

    // 2. Build where clause
    const searchFilter: Prisma.BookingWhereInput = search
      ? {
          OR: [
            { reference: { contains: search, mode: "insensitive" } },
            { flight: { flightNumber: { contains: search, mode: "insensitive" } } },
            { flight: { departure: { code: { contains: search, mode: "insensitive" } } } },
            { flight: { arrival: { code: { contains: search, mode: "insensitive" } } } },
            { flight: { departure: { city: { contains: search, mode: "insensitive" } } } },
            { flight: { arrival: { city: { contains: search, mode: "insensitive" } } } },
          ],
        }
      : {}

    const statusFilter: Prisma.BookingWhereInput = status ? { status: { in: Array.isArray(status) ? status : [status] } } : {}

    const classTypeFilter: Prisma.BookingWhereInput = classType ? { seatClass: { class: { in: Array.isArray(classType) ? classType : [classType] } } } : {}

    const upcomingFilter: Prisma.BookingWhereInput = upcoming ? { flight: { departureTime: { gte: new Date() } } } : {}

    const pastFilter: Prisma.BookingWhereInput = upcoming === false ? { flight: { departureTime: { lt: new Date() } } } : {}

    const where: Prisma.BookingWhereInput = {
      userId: user.id,
      ...searchFilter,
      ...statusFilter,
      ...classTypeFilter,
      ...upcomingFilter,
      ...pastFilter,
    }

    const hasFilters = !!search || !!status || upcoming !== undefined

    // 3. Run count + fetch
    const [total, items] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: [{ flight: { departureTime: "asc" } }, { id: "asc" }],
        select: {
          id: true,
          reference: true,
          status: true,
          paymentStatus: true,
          totalAmount: true,
          isReturnTrip: true,
          seatClass: { select: { class: true } },
          flight: {
            select: {
              id: true,
              flightNumber: true,
              departureTime: true,
              arrivalTime: true,
              departure: { select: { code: true, city: true } },
              arrival: { select: { code: true, city: true } },
            },
          },
          passengers: { select: { id: true } },
        },
      }),
    ])

    // 4. Empty states
    if (total === 0 && !hasFilters) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: "No flights found. Book your first flight with Kenya Airways.",
        data: buildPaginatedResult<UserFlight>({
          items: [],
          total: 0,
          limit,
          isFiltered: false,
        }),
      })
    }

    if (total === 0) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: search ? `No flights found matching "${search}".` : "No flights match the selected filters.",
        data: buildPaginatedResult<UserFlight>({
          items: [],
          total: 0,
          limit,
          isFiltered: true,
          search,
        }),
      })
    }

    // 5. Map items
    const mappedItems: UserFlight[] = items.map(b => ({
      id: b.flight.id,
      bookingId: b.id,
      bookingReference: b.reference,
      bookingStatus: b.status,
      flightNumber: b.flight.flightNumber,
      from: b.flight.departure.code,
      fromCity: b.flight.departure.city,
      to: b.flight.arrival.code,
      toCity: b.flight.arrival.city,
      departureTime: b.flight.departureTime,
      arrivalTime: b.flight.arrivalTime,
      classType: b.seatClass?.class || "ECONOMY",
      passengerCount: b.passengers.length,
      totalAmount: b.totalAmount,
      paymentStatus: b.paymentStatus,
      isReturnTrip: b.isReturnTrip,
    }))

    // 6. Build paginated result
    const paginated = buildPaginatedResult<UserFlight>({
      items: mappedItems,
      total,
      limit,
      isFiltered: hasFilters,
      search,
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: hasFilters ? `Found ${total} flight${total === 1 ? "" : "s"} matching your search.` : `Showing ${mappedItems.length} of ${total} flight${total === 1 ? "" : "s"}.`,
      data: paginated,
    })
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return errorResponse({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      })
    }
    return errorResponse({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "Failed to fetch your flights. Please try again.",
    })
  }
}
