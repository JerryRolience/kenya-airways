"use server"

import { AirportInfo, FlightSearchResult, SeatClassAvailability } from "@/types/flights"
import { ClassType, FlightStatus } from "../../../../../generated/prisma/enums"
import prisma from "@/lib/prisma"

interface FindFlightsByRouteParams {
  fromCode: string
  toCode: string
  date: Date
  cabinClass: ClassType
  passengers: number
}

//  Helper: Find flights for a route on a given date
export async function findFlightsByRoute(params: FindFlightsByRouteParams): Promise<FlightSearchResult[]> {
  const { fromCode, toCode, date, cabinClass, passengers } = params

  // 1. Set date range for the entire day
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)

  const nextDayStart = new Date(date)
  nextDayStart.setDate(nextDayStart.getDate() + 1)
  nextDayStart.setHours(0, 0, 0, 0)

  // 2. Query flights departing from the specified airport to the destination airport on the given date
  const flights = await prisma.flight.findMany({
    where: {
      departure: { code: fromCode },
      arrival: { code: toCode },
      departureTime: { gte: dayStart, lt: nextDayStart },
      status: FlightStatus.SCHEDULED,
    },
    include: {
      departure: { select: { id: true, code: true, name: true, city: true, country: true } },
      arrival: { select: { id: true, code: true, name: true, city: true, country: true } },
      seatClasses: {
        where: { class: cabinClass },
        select: { id: true, class: true, totalSeats: true, priceKES: true },
      },
      _count: {
        select: {
          seats: {
            where: {
              seatClass: { class: cabinClass },
              isBooked: false,
              isBlocked: false,
            },
          },
        },
      },
    },
    orderBy: { departureTime: "asc" },
  })

  return flights.map(flight => {
    const seatClass = flight.seatClasses[0]
    const availableSeats = flight._count.seats
    const totalSeats = seatClass?.totalSeats || 0
    const bookedSeats = totalSeats - availableSeats

    const seatClassInfo: SeatClassAvailability = {
      id: seatClass?.id || "",
      class: cabinClass,
      totalSeats,
      bookedSeats,
      availableSeats,
      priceKES: seatClass?.priceKES || 0,
      isFull: availableSeats < passengers,
      hasEnoughSeats: availableSeats >= passengers,
    }

    const durationMs = flight.arrivalTime.getTime() - flight.departureTime.getTime()
    const durationMinutes = Math.round(durationMs / (1000 * 60))

    return {
      id: flight.id,
      flightNumber: flight.flightNumber,
      departure: flight.departure as AirportInfo,
      arrival: flight.arrival as AirportInfo,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      duration: durationMinutes,
      status: flight.status,
      seatClasses: [seatClassInfo],
      isDirect: true,
      stopsCount: 0,
    }
  })
}
