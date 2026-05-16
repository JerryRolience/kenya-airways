"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { buildPaginatedResult } from "@/actions/lib/pagination"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { UserPayment, UserPaymentsResponse } from "@/types/payment"
import { FetchUserPaymentsInput } from "@/validators/payment"
import { Prisma } from "../../../../generated/prisma/client"

export async function fetchUserPayments(input: FetchUserPaymentsInput = { limit: 10 }): Promise<UserPaymentsResponse> {
  try {
    const { cursor, limit = 10, search, method } = input

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
    const searchFilter: Prisma.PaymentWhereInput = search
      ? {
          OR: [
            { transactionRef: { contains: search, mode: "insensitive" } },
            { booking: { reference: { contains: search, mode: "insensitive" } } },
            { booking: { flight: { flightNumber: { contains: search, mode: "insensitive" } } } },
            { booking: { flight: { departure: { code: { contains: search, mode: "insensitive" } } } } },
            { booking: { flight: { arrival: { code: { contains: search, mode: "insensitive" } } } } },
          ],
        }
      : {}

    const where: Prisma.PaymentWhereInput = {
      booking: { userId: user.id },
      ...(method && { method: Array.isArray(method) ? { in: method } : method }),
      ...searchFilter,
    }

    const hasFilters = !!search || !!method

    // 3. Run count + fetch
    const [total, items] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        take: limit + 1,
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        orderBy: [{ paidAt: "desc" }, { id: "asc" }],
        select: {
          id: true,
          amount: true,
          method: true,
          transactionRef: true,
          paidAt: true,
          booking: {
            select: {
              reference: true,
              status: true,
              flight: {
                select: {
                  flightNumber: true,
                  departureTime: true,
                  departure: { select: { code: true } },
                  arrival: { select: { code: true } },
                },
              },
            },
          },
        },
      }),
    ])

    // 4. Empty states
    if (total === 0 && !hasFilters) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: "No payments found. Your payment history will appear here after you book a flight.",
        data: buildPaginatedResult<UserPayment>({
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
        message: search ? `No payments found matching "${search}".` : "No payments match the selected filters.",
        data: buildPaginatedResult<UserPayment>({
          items: [],
          total: 0,
          limit,
          isFiltered: true,
          search,
        }),
      })
    }

    // 5. Map items
    const mappedItems: UserPayment[] = items.map(p => ({
      id: p.id,
      amount: p.amount,
      method: p.method,
      transactionRef: p.transactionRef,
      paidAt: p.paidAt,
      bookingReference: p.booking.reference,
      bookingStatus: p.booking.status,
      flightNumber: p.booking.flight.flightNumber,
      from: p.booking.flight.departure.code,
      to: p.booking.flight.arrival.code,
      departureTime: p.booking.flight.departureTime,
    }))

    // 6. Build paginated result
    const paginated = buildPaginatedResult<UserPayment>({
      items: mappedItems,
      total,
      limit,
      isFiltered: hasFilters,
      search,
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: hasFilters ? `Found ${total} payment${total === 1 ? "" : "s"} matching your search.` : `Showing ${mappedItems.length} of ${total} payment${total === 1 ? "" : "s"}.`,
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
      message: "Failed to fetch your payments. Please try again.",
    })
  }
}
