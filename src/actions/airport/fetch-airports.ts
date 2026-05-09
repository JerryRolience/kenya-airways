"use server"

import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { AirportInfo } from "@/types/flights"

export async function fetchAirports(): Promise<ApiResponse<AirportInfo[]>> {
  try {
    const data = await prisma.airport.findMany({
      select: { id: true, code: true, name: true, city: true, country: true },
      orderBy: { city: "asc" },
    })

    const airports: AirportInfo[] = data.map(airport => ({
      ...airport,
      label: `${airport.city} (${airport.code})`,
    }))

    return successResponse({ data: airports })
  } catch (error: any) {
    const resolved = error instanceof HttpError ? error : error

    return errorResponse({
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An unexpected error occurred while fetching airport information. Please try again later.",
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    })
  }
}
