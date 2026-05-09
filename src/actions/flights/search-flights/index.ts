"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import { ApiResponse } from "@/types/api-response"
import { FlightSearchParams, FlightSearchResponse, FlightSearchResult, NextAvailableFlight, TripTypeOptions } from "@/types/flights"
import { FlightSearchParamsSchema } from "@/validators/flights"
import { findFlightsByRoute } from "./utils/find-flights-by-route"
import { findNextAvailableByRoute } from "./utils/find-next-available-by-route"

export async function searchFlights(data: FlightSearchParams): Promise<ApiResponse<FlightSearchResponse>> {
  console.log("Received flight search data:", data)

  try {
    // 1. Validate incoming data
    const { from: fromCode, to: toCode, date, returnDate, tripType, class: cabinClass, passengers } = FlightSearchParamsSchema.parse(data)

    console.log("Validated search params:", {
      from: fromCode,
      to: toCode,
      date,
      returnDate,
      tripType,
      class: cabinClass,
      passengers,
    })

    if (fromCode === toCode) {
      throw new HttpError({
        statusCode: STATUS_CODES.BAD_REQUEST,
        message: "Origin and destination must be different.",
      })
    }

    // 2. Fetch outbound flights
    const outboundFlights = await findFlightsByRoute({
      fromCode,
      toCode,
      date,
      cabinClass,
      passengers,
    })

    console.log(`Found ${outboundFlights.length} outbound flights`)

    // 3. Check if all outbound flights are full
    const hasAvailableOutbound = outboundFlights.some(f => !f.seatClasses[0]?.isFull)
    const isAllOutboundFull = outboundFlights.length > 0 && !hasAvailableOutbound

    // 4. Find next available outbound if everything is full
    let nextAvailable: NextAvailableFlight | null = null
    if (isAllOutboundFull || outboundFlights.length === 0) {
      nextAvailable = await findNextAvailableByRoute({
        fromCode,
        toCode,
        afterDate: date,
        cabinClass,
        passengers,
      })

      if (nextAvailable) {
        console.log("Next available flight found:", {
          date: nextAvailable.date,
          flightNumber: nextAvailable.flightNumber,
        })
      }
    }

    // 5. Fetch return flights if round trip
    let returnFlights: FlightSearchResult[] = []
    if (tripType === TripTypeOptions[1] && returnDate) {
      returnFlights = await findFlightsByRoute({
        fromCode: toCode, // Swap for return
        toCode: fromCode, // Swap for return
        date: returnDate,
        cabinClass,
        passengers,
      })

      console.log(`Found ${returnFlights.length} return flights`)
    }

    // 6. Build filter metadata
    const allFlights = [...outboundFlights, ...returnFlights]
    const totalResults = allFlights.length

    // Extract unique airlines
    const airlines = [...new Set(allFlights.map(f => f.flightNumber.match(/^[A-Z]+/)?.[0] || "KQ"))]

    // Calculate price range
    const prices = allFlights.map(f => f.seatClasses[0]?.priceKES).filter((p): p is number => p !== undefined && p > 0)

    const cheapestPrice = prices.length > 0 ? Math.min(...prices) : null

    // Check if everything (outbound + return) is full
    const hasAvailableReturn = returnFlights.length === 0 || returnFlights.some(f => !f.seatClasses[0]?.isFull)
    const isAllFull = isAllOutboundFull || !hasAvailableReturn

    // 7. Build response
    const response: FlightSearchResponse = {
      searchParams: { from: fromCode, to: toCode, date, returnDate, tripType, class: cabinClass, passengers },
      outboundFlights,
      returnFlights,
      nextAvailable,
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
  } catch (error: any) {
    const resolved = error instanceof HttpError ? error : error

    console.error("Flight search error:", resolved)

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An unexpected error occurred while searching for flights. Please try again later.",
    })
  }
}
