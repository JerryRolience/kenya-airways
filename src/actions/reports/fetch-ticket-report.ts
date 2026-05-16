"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { FetchTicketReportInput, TicketReportItem, TicketReportResponse } from "@/types/ticket"
import { Prisma } from "../../../generated/prisma/browser"

export async function fetchTicketReport(input: FetchTicketReportInput = {}): Promise<TicketReportResponse> {
  try {
    // 1. Authenticate
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "Access denied. You must be authenticated to view ticket reports.",
      })
    }

    if (!res.data.isAdmin) {
      throw new HttpError({
        statusCode: STATUS_CODES.FORBIDDEN,
        message: "Access denied. Only administrators can view ticket reports.",
      })
    }

    // 2. Build where clause
    const searchFilter: Prisma.TicketWhereInput = input.search
      ? {
          OR: [
            { ticketNumber: { contains: input.search, mode: "insensitive" } },
            {
              bookingPassenger: {
                passenger: {
                  OR: [
                    { firstName: { contains: input.search, mode: "insensitive" } },
                    { lastName: { contains: input.search, mode: "insensitive" } },
                    { email: { contains: input.search, mode: "insensitive" } },
                  ],
                },
              },
            },
            {
              bookingPassenger: {
                booking: {
                  flight: {
                    flightNumber: { contains: input.search, mode: "insensitive" },
                  },
                },
              },
            },
          ],
        }
      : {}

    const flightFilter: Prisma.TicketWhereInput = input.flightNumber
      ? {
          bookingPassenger: {
            booking: {
              flight: { flightNumber: input.flightNumber },
            },
          },
        }
      : {}

    const classFilter: Prisma.TicketWhereInput = input.class
      ? {
          bookingPassenger: {
            booking: {
              seatClass: { class: input.class as any },
            },
          },
        }
      : {}

    const statusFilter: Prisma.TicketWhereInput = input.status ? { status: input.status as any } : {}

    const dateFilter: Prisma.TicketWhereInput = {}
    if (input.fromDate) {
      dateFilter.issuedAt = { gte: new Date(input.fromDate) }
    }
    if (input.toDate) {
      dateFilter.issuedAt = {
        ...(dateFilter.issuedAt as any),
        lte: new Date(input.toDate),
      }
    }

    const where: Prisma.TicketWhereInput = {
      ...searchFilter,
      ...flightFilter,
      ...classFilter,
      ...statusFilter,
      ...(Object.keys(dateFilter).length > 0 ? dateFilter : {}),
    }

    // 3. Fetch tickets
    const tickets = await prisma.ticket.findMany({
      where,
      orderBy: { issuedAt: "desc" },
      select: {
        id: true,
        ticketNumber: true,
        status: true,
        issuedAt: true,
        bookingPassenger: {
          select: {
            seatNumber: true,
            passenger: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            booking: {
              select: {
                reference: true,
                paymentStatus: true,
                totalAmount: true,
                seatClass: {
                  select: {
                    class: true,
                    priceKES: true,
                  },
                },
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
        },
      },
    })

    // 4. Aggregate stats
    const allTickets = await prisma.ticket.findMany({
      where,
      select: {
        status: true,
        bookingPassenger: {
          select: {
            booking: {
              select: {
                totalAmount: true,
                seatClass: { select: { class: true } },
              },
            },
          },
        },
      },
    })

    const totalRevenue = allTickets.reduce((sum, t) => sum + (t.bookingPassenger?.booking?.totalAmount || 0), 0)

    const byClass = {
      executive: allTickets.filter(t => t.bookingPassenger?.booking?.seatClass?.class === "EXECUTIVE").length,
      middle: allTickets.filter(t => t.bookingPassenger?.booking?.seatClass?.class === "MIDDLE").length,
      economy: allTickets.filter(t => t.bookingPassenger?.booking?.seatClass?.class === "ECONOMY").length,
    }

    const byStatus = {
      active: allTickets.filter(t => t.status === "ACTIVE").length,
      used: allTickets.filter(t => t.status === "USED").length,
      cancelled: allTickets.filter(t => t.status === "CANCELLED").length,
    }

    // 5. Map to response
    const mappedTickets: TicketReportItem[] = tickets.map(ticket => ({
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      status: ticket.status,
      issuedAt: ticket.issuedAt,
      passengerName: `${ticket.bookingPassenger?.passenger?.firstName || ""} ${ticket.bookingPassenger?.passenger?.lastName || ""}`,
      passengerEmail: ticket.bookingPassenger?.passenger?.email || "",
      flightNumber: ticket.bookingPassenger?.booking?.flight?.flightNumber || "",
      from: ticket.bookingPassenger?.booking?.flight?.departure?.code || "",
      to: ticket.bookingPassenger?.booking?.flight?.arrival?.code || "",
      departureTime: ticket.bookingPassenger?.booking?.flight?.departureTime || new Date(),
      seatNumber: ticket.bookingPassenger?.seatNumber || null,
      class: ticket.bookingPassenger?.booking?.seatClass?.class || "",
      priceKES: ticket.bookingPassenger?.booking?.seatClass?.priceKES || 0,
      bookingReference: ticket.bookingPassenger?.booking?.reference || "",
      paymentStatus: ticket.bookingPassenger?.booking?.paymentStatus || "",
    }))

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `${mappedTickets.length} ticket${mappedTickets.length !== 1 ? "s" : ""} found.`,
      data: {
        tickets: mappedTickets,
        totalTickets: allTickets.length,
        totalRevenue,
        byClass,
        byStatus,
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while fetching ticket report.",
    })
  }
}
