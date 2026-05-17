"use server"

import { generateUniqueBookingReference, generateUniqueTicketNumber } from "@/actions/lib/generate-codes"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { CreatedBookingResult } from "@/types/booking"
import { CreateBookingSchema, CreateBookingInput } from "@/validators/booking"
import { currentUser } from "@clerk/nextjs/server"
import { FlightStatus, BookingStatus, PaymentStatus, ClassType } from "../../../../generated/prisma/enums"

//  Helper: resolve seatClass from flightId + classType

async function resolveSeatClass(tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, flightId: string, classType: ClassType) {
  const seatClass = await tx.seatClass.findUnique({
    where: { flightId_class: { flightId, class: classType } },
    select: {
      id: true,
      class: true,
      totalSeats: true,
      bookedSeats: true,
      priceKES: true,
    },
  })

  if (!seatClass) {
    throw new HttpError({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: `No ${classType.toLowerCase()} class available on this flight.`,
    })
  }

  return seatClass
}

//  Helper: check seat availability
function assertSeatsAvailable(seatClass: { id: string; totalSeats: number; bookedSeats: number; class: ClassType }, passengers: number, flightLabel: string) {
  const available = seatClass.totalSeats - seatClass.bookedSeats
  if (available < passengers) {
    throw new HttpError({
      statusCode: STATUS_CODES.CONFLICT,
      message:
        available === 0
          ? `Sorry — ${seatClass.class.toLowerCase()} class on the ${flightLabel} flight is now fully booked. Please select a different flight or class.`
          : `Sorry — only ${available} seat${available !== 1 ? "s" : ""} left on the ${flightLabel} flight. You need ${passengers}.`,
    })
  }
}

//  Helper: validate flight is still bookable

async function assertFlightBookable(tx: Omit<typeof prisma, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">, flightId: string, label: string) {
  const flight = await tx.flight.findUnique({
    where: { id: flightId },
    select: {
      id: true,
      flightNumber: true,
      status: true,
      departureTime: true,
      departure: { select: { code: true, city: true } },
      arrival: { select: { code: true, city: true } },
    },
  })

  if (!flight) {
    throw new HttpError({
      statusCode: STATUS_CODES.NOT_FOUND,
      message: `${label} flight not found. It may have been removed.`,
    })
  }

  // Cannot book cancelled or already departed flights
  const nonBookable: FlightStatus[] = [FlightStatus.CANCELLED, FlightStatus.DEPARTED, FlightStatus.ARRIVED]
  if (nonBookable.includes(flight.status)) {
    throw new HttpError({
      statusCode: STATUS_CODES.CONFLICT,
      message: `The ${label} flight (${flight.flightNumber}) is ${flight.status.toLowerCase()} and can no longer be booked.`,
    })
  }

  // Cannot book a flight departing within the next 2 hours
  const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000)
  if (flight.departureTime <= twoHoursFromNow) {
    throw new HttpError({
      statusCode: STATUS_CODES.CONFLICT,
      message: `The ${label} flight departs too soon. Bookings close 2 hours before departure.`,
    })
  }

  return flight
}

//  Helper: validate total amount matches DB prices

function assertTotalAmountCorrect(outboundPriceKES: number, returnPriceKES: number, passengers: number, submittedTotal: number) {
  const expectedTotal = (outboundPriceKES + returnPriceKES) * passengers

  // Allow ±1 KES for rounding differences
  if (Math.abs(expectedTotal - submittedTotal) > 1) {
    throw new HttpError({
      statusCode: STATUS_CODES.BAD_REQUEST,
      message: `Price mismatch. Expected KES ${expectedTotal.toLocaleString()} but received KES ${submittedTotal.toLocaleString()}. Please refresh and try again.`,
    })
  }
}

export async function createBooking(data: CreateBookingInput): Promise<ApiResponse<CreatedBookingResult>> {
  try {
    //  1. Validate input
    const parsed = CreateBookingSchema.safeParse(data)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      const path = firstError?.path.join(" → ") ?? "input"
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: `${path}: ${firstError?.message ?? "Invalid booking data."}`,
      })
    }

    const { outboundFlightId, returnFlightId, isReturnTrip, classType, passengers, paymentMethod, transactionRef, totalAmount } = parsed.data

    //  2. Auth check
    const clerkUser = await currentUser()
    if (!clerkUser) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You must be signed in to complete a booking.",
      })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true },
    })
    if (!dbUser) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "User account not found. Please sign in again.",
      })
    }

    // ── 3. Generate unique codes BEFORE the transaction ───────────────────────
    // Done outside the transaction to avoid holding the DB lock while generating
    const bookingReference = await generateUniqueBookingReference(prisma)
    const ticketNumbers = await Promise.all(passengers.map(() => generateUniqueTicketNumber(prisma)))

    // ── 4. The $transaction ───────────────────────────────────────────────────
    const result = await prisma.$transaction(
      async tx => {
        // ── 4a. Validate both flights ──────────────────────────────────────────
        const outboundFlight = await assertFlightBookable(tx, outboundFlightId, "outbound")
        let returnFlight = null
        if (isReturnTrip && returnFlightId) {
          returnFlight = await assertFlightBookable(tx, returnFlightId, "return")
        }

        // ── 4b. Resolve + check seat classes ───────────────────────────────────
        const outboundSeatClass = await resolveSeatClass(tx, outboundFlightId, classType)
        assertSeatsAvailable(outboundSeatClass, passengers.length, "outbound")

        let returnSeatClass = null
        if (isReturnTrip && returnFlightId) {
          returnSeatClass = await resolveSeatClass(tx, returnFlightId, classType)
          assertSeatsAvailable(returnSeatClass, passengers.length, "return")
        }

        // ── 4c. Validate submitted total against DB prices ────────────────────
        assertTotalAmountCorrect(outboundSeatClass.priceKES, returnSeatClass?.priceKES ?? 0, passengers.length, totalAmount)

        // ── 4d. Upsert passengers ─────────────────────────────────────────────
        // upsert: if same user books same passport again, update details
        const passengerRecords = await Promise.all(
          passengers.map(p =>
            tx.passenger.upsert({
              where: {
                userId_passportNumber: {
                  userId: dbUser.id,
                  passportNumber: p.passportNumber.toUpperCase(),
                },
              },
              update: {
                title: p.title,
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                phone: p.phone,
                nationality: p.nationality,
                dateOfBirth: p.dateOfBirth,
                relationship: p.relationship,
              },
              create: {
                userId: dbUser.id,
                title: p.title,
                firstName: p.firstName,
                lastName: p.lastName,
                email: p.email,
                phone: p.phone,
                passportNumber: p.passportNumber.toUpperCase(),
                nationality: p.nationality,
                dateOfBirth: p.dateOfBirth,
                relationship: p.relationship,
              },
              select: { id: true, firstName: true, lastName: true },
            }),
          ),
        )

        // ── 4e. Create the Booking record ──────────────────────────────────────
        const booking = await tx.booking.create({
          data: {
            reference: bookingReference,
            userId: dbUser.id,
            flightId: outboundFlightId,
            seatClassId: outboundSeatClass.id,
            returnFlightId: returnFlightId ?? null,
            isReturnTrip,
            status: BookingStatus.PENDING,
            totalAmount,
            paymentStatus: PaymentStatus.UNPAID,
          },
          select: { id: true },
        })

        // ── 4f. Create BookingPassenger for each passenger ─────────────────────
        const bookingPassengers = await Promise.all(
          passengerRecords.map(passenger =>
            tx.bookingPassenger.create({
              data: {
                bookingId: booking.id,
                passengerId: passenger.id,
              },
              select: { id: true },
            }),
          ),
        )

        // ── 4g. Increment outbound SeatClass.bookedSeats ───────────────────────
        await tx.seatClass.update({
          where: { id: outboundSeatClass.id },
          data: { bookedSeats: { increment: passengers.length } },
        })

        // ── 4h. Increment return SeatClass.bookedSeats (if round trip) ────────
        if (returnSeatClass) {
          await tx.seatClass.update({
            where: { id: returnSeatClass.id },
            data: { bookedSeats: { increment: passengers.length } },
          })
        }

        // ── 4i. Create Payment record ──────────────────────────────────────────
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            amount: totalAmount,
            method: paymentMethod,
            transactionRef: transactionRef ?? null,
          },
        })

        // ── 4j. Create one Ticket per BookingPassenger ─────────────────────────
        await Promise.all(
          bookingPassengers.map((bp, index) =>
            tx.ticket.create({
              data: {
                bookingPassengerId: bp.id,
                ticketNumber: ticketNumbers[index]!,
              },
            }),
          ),
        )

        // ── 4k. Confirm the Booking ────────────────────────────────────────────
        await tx.booking.update({
          where: { id: booking.id },
          data: {
            status: BookingStatus.CONFIRMED,
            paymentStatus: PaymentStatus.PAID,
          },
        })

        return {
          bookingId: booking.id,
          reference: bookingReference,
          outboundFlight,
          returnFlight,
        }
      },
      {
        timeout: 15000, // 15 seconds (up from default 5s)
      },
    ) // end $transaction

    // ── 5. Build response ─────────────────────────────────────────────────────
    return successResponse<CreatedBookingResult>({
      statusCode: STATUS_CODES.CREATED,
      message: `Booking confirmed! Your reference is ${result.reference}.`,
      data: {
        bookingId: result.bookingId,
        reference: result.reference,
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        totalAmount,
        ticketNumbers,
        outboundFlight: {
          flightNumber: result.outboundFlight.flightNumber,
          departureTime: result.outboundFlight.departureTime,
          from: result.outboundFlight.departure.code,
          to: result.outboundFlight.arrival.code,
        },
        ...(result.returnFlight
          ? {
              returnFlight: {
                flightNumber: result.returnFlight.flightNumber,
                departureTime: result.returnFlight.departureTime,
                from: result.returnFlight.departure.code,
                to: result.returnFlight.arrival.code,
              },
            }
          : {}),
      },
    })
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return errorResponse({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      })
    }

    // Prisma unique constraint — duplicate booking passenger
    if (typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "P2002") {
      return errorResponse({
        statusCode: STATUS_CODES.CONFLICT,
        error: "Duplicate Booking",
        message: "One of the passengers already has an active booking on this flight.",
      })
    }

    console.error("[createBooking] unexpected error:", error)
    return errorResponse({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "An unexpected error occurred while creating your booking. Please try again.",
      type: "FATAL",
    })
  }
}
