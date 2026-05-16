"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { buildPaginatedResult } from "@/actions/lib/pagination"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { BookingListItem, FetchBookingsResponse } from "@/types/booking"
import { FetchBookingsInput, FetchBookingsSchema } from "@/validators/booking"
import { Prisma } from "../../../../generated/prisma/client"

export async function fetchUserBookings(input: FetchBookingsInput = { limit: 10 }): Promise<FetchBookingsResponse> {
  try {
    // 1. Validate input
    const validated = FetchBookingsSchema.parse(input)
    const { cursor, limit, search, status, paymentStatus } = validated

    // 2. Authentication
    const res = await isUserAuthenticated()

    if (!res.success || !res.data) {
      throw new HttpError({
        message: res.message || "Authentication failed. Please log in again.",
        statusCode: res.statusCode || STATUS_CODES.UNAUTHORIZED,
      })
    }

    const { user } = res.data

    // 3. Build where clause
    const searchFilter: Prisma.BookingWhereInput = search
      ? {
          OR: [
            { reference: { contains: search, mode: "insensitive" } },
            {
              flight: {
                flightNumber: { contains: search, mode: "insensitive" },
              },
            },
            {
              flight: {
                departure: { code: { contains: search, mode: "insensitive" } },
              },
            },
            {
              flight: {
                arrival: { code: { contains: search, mode: "insensitive" } },
              },
            },
            {
              flight: {
                departure: { city: { contains: search, mode: "insensitive" } },
              },
            },
            {
              flight: {
                arrival: { city: { contains: search, mode: "insensitive" } },
              },
            },
          ],
        }
      : {}

    const where: Prisma.BookingWhereInput = {
      userId: user.id,
      ...(status && { status: Array.isArray(status) ? { in: status } : status }),
      ...(paymentStatus && { paymentStatus: Array.isArray(paymentStatus) ? { in: paymentStatus } : paymentStatus }),
      ...searchFilter,
    }

    const hasFilters = !!search || !!status || !!paymentStatus

    // 4. Run count + fetch in parallel
    const [total, items] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: {
          id: true,
          reference: true,
          status: true,
          paymentStatus: true,
          totalAmount: true,
          isReturnTrip: true,
          createdAt: true,
          seatClass: { select: { class: true } },
          flight: {
            select: {
              flightNumber: true,
              departureTime: true,
              departure: { select: { code: true, city: true } },
              arrival: { select: { code: true, city: true } },
            },
          },
          returnFlight: {
            select: { flightNumber: true, departureTime: true },
          },
          passengers: { select: { id: true } },
        },
      }),
    ])

    // 5. Empty states
    if (total === 0 && !hasFilters) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: "No bookings found. Book your first flight with Kenya Airways.",
        data: buildPaginatedResult<BookingListItem>({
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
        message: search ? `No bookings found matching "${search}".` : "No bookings match the selected filters.",
        data: buildPaginatedResult<BookingListItem>({
          items: [],
          total: 0,
          limit,
          isFiltered: true,
          search,
        }),
      })
    }

    // 6. Map items
    const mappedItems: BookingListItem[] = items.map(b => ({
      id: b.id,
      reference: b.reference,
      status: b.status,
      paymentStatus: b.paymentStatus,
      totalAmount: b.totalAmount,
      isReturnTrip: b.isReturnTrip,
      createdAt: b.createdAt,
      classType: b.seatClass.class,
      passengerCount: b.passengers.length,
      outboundFlight: {
        flightNumber: b.flight.flightNumber,
        departureTime: b.flight.departureTime,
        from: b.flight.departure.code,
        to: b.flight.arrival.code,
        fromCity: b.flight.departure.city,
        toCity: b.flight.arrival.city,
      },
      returnFlight: b.returnFlight
        ? {
            flightNumber: b.returnFlight.flightNumber,
            departureTime: b.returnFlight.departureTime,
          }
        : undefined,
    }))

    // 7. Build paginated result
    const paginated = buildPaginatedResult<BookingListItem>({
      items: mappedItems,
      total,
      limit,
      isFiltered: hasFilters,
      search,
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: hasFilters ? `Found ${total} booking${total === 1 ? "" : "s"} matching your search.` : `Showing ${mappedItems.length} of ${total} booking${total === 1 ? "" : "s"}.`,
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
      message: "Failed to fetch your bookings. Please try again.",
    })
  }
}
