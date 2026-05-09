"use server"

import { NextAvailableFlight } from "@/types/flights"
import { ClassType, FlightStatus } from "../../../../../generated/prisma/enums"
import prisma from "@/lib/prisma"

interface FindNextAvailableFlightParams {
  fromCode: string
  toCode: string
  afterDate: Date
  cabinClass: ClassType
  passengers: number
}

//  Helper: Find next available flight for a route
export async function findNextAvailableByRoute(params: FindNextAvailableFlightParams): Promise<NextAvailableFlight | null> {
  const { fromCode, toCode, afterDate, cabinClass, passengers } = params

  const nextFlight = await prisma.flight.findFirst({
    where: {
      departure: { code: fromCode },
      arrival: { code: toCode },
      departureTime: { gt: afterDate },
      status: FlightStatus.SCHEDULED,
      seats: {
        some: {
          seatClass: { class: cabinClass },
          isBooked: false,
          isBlocked: false,
        },
      },
    },
    include: {
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
      seatClasses: { where: { class: cabinClass }, select: { priceKES: true } },
    },
    orderBy: { departureTime: "asc" },
  })

  if (!nextFlight || nextFlight._count.seats < passengers) {
    return null
  }

  return {
    date: nextFlight.departureTime,
    availableSeats: nextFlight._count.seats,
    priceKES: nextFlight.seatClasses[0]?.priceKES || 0,
    flightId: nextFlight.id,
    flightNumber: nextFlight.flightNumber,
  }
}
