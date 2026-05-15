"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import { ApiResponse } from "@/types/api-response"
import { FlightSearchParams, FlightSearchResponse, FlightSearchResult, NextAvailableFlight } from "@/types/flights"
import { FlightSearchParamsSchema } from "@/validators/flights"
import { findNextAvailableByRoute, findFlightsByRoute } from "./utils"

export async function searchFlights(data: FlightSearchParams): Promise<ApiResponse<FlightSearchResponse>> {
  try {
    //  1. Validate
    const { from: fromCode, to: toCode, date, returnDate, tripType, class: cabinClass, passengers } = FlightSearchParamsSchema.parse(data)

    if (fromCode === toCode) {
      throw new HttpError({ statusCode: STATUS_CODES.BAD_REQUEST, message: "Origin and destination must be different." })
    }

    //  2. Outbound flights
    const outboundFlights = await findFlightsByRoute({ fromCode, toCode, date, cabinClass, passengers })

    //  3. Next available outbound (when outbound date is fully booked)
    const hasAvailableOutbound = outboundFlights.some(f => f.seatClasses[0] && !f.seatClasses[0].isFull && f.seatClasses[0].hasEnoughSeats)
    const isOutboundProblematic = outboundFlights.length === 0 || !hasAvailableOutbound

    let nextAvailable: NextAvailableFlight | null = null
    if (isOutboundProblematic) {
      nextAvailable = await findNextAvailableByRoute({
        fromCode,
        toCode,
        afterDate: date,
        cabinClass,
        passengers,
      })
    }

    //  4. Return flights
    let returnFlights: FlightSearchResult[] = []
    let nextAvailableReturn: NextAvailableFlight | null = null

    if (tripType === "return" && returnDate) {
      returnFlights = await findFlightsByRoute({
        fromCode: toCode, // reversed
        toCode: fromCode, // reversed
        date: returnDate,
        cabinClass,
        passengers,
      })

      //  5. Next available RETURN (when return date has no flights / all full)
      const hasAvailableReturn = returnFlights.some(f => f.seatClasses[0] && !f.seatClasses[0].isFull && f.seatClasses[0].hasEnoughSeats)
      const isReturnProblematic = returnFlights.length === 0 || !hasAvailableReturn

      if (isReturnProblematic) {
        nextAvailableReturn = await findNextAvailableByRoute({
          fromCode: toCode, // reversed — return goes from destination back to origin
          toCode: fromCode,
          afterDate: returnDate,
          cabinClass,
          passengers,
        })
      }
    }

    //  6. Build filter metadata
    const allFlights = [...outboundFlights, ...returnFlights]
    const totalResults = allFlights.length
    const airlines = [...new Set(allFlights.map(f => f.flightNumber.match(/^[A-Z]+/)?.[0] || "KQ"))]
    const prices = allFlights.map(f => f.seatClasses[0]?.priceKES).filter((p): p is number => p !== undefined && p > 0)
    const cheapestPrice = prices.length > 0 ? Math.min(...prices) : null

    const hasAvailableReturnFinal = returnFlights.length === 0 || returnFlights.some(f => f.seatClasses[0] && !f.seatClasses[0].isFull && f.seatClasses[0].hasEnoughSeats)
    const isAllFull = !hasAvailableOutbound || !hasAvailableReturnFinal

    //  7. Response
    const response: FlightSearchResponse = {
      searchParams: {
        from: fromCode,
        to: toCode,
        date,
        returnDate,
        tripType,
        class: cabinClass,
        passengers,
      },
      outboundFlights,
      returnFlights,
      nextAvailable,
      nextAvailableReturn,
      isNoOutboundRoute: outboundFlights.length === 0 && !nextAvailable, // true if there are no outbound flights at all (used to show specific messaging in UI) and all outbound flights are full or non-existent
      isNoReturnRoute: returnFlights.length === 0 && tripType === "return" && !nextAvailableReturn, // true if user searched for return trip but there are no return flights at all (used for specific messaging in UI) and all return flights are full or non-existent
      isAllFull,
      totalResults,
      cheapestPrice,
      filters: {
        airlines,
        priceRange: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0,
        },
      },
    }

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: `Found ${totalResults} flight${totalResults !== 1 ? "s" : ""}.`,
      data: response,
    })
  } catch (error: unknown) {
    if (error instanceof HttpError) {
      return errorResponse({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
      })
    }
    console.error("[searchFlights] unexpected error:", error)
    return errorResponse({
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "An unexpected error occurred while searching for flights. Please try again later.",
    })
  }
}
