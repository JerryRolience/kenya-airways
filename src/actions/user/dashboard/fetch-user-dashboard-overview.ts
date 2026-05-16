"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { UserDashboardOverviewResponse } from "@/types/user-dashboard"
import { ApplicationStatus, BookingStatus } from "../../../../generated/prisma/enums"

export async function fetchUserDashboardOverview(): Promise<UserDashboardOverviewResponse> {
  try {
    const res = await isUserAuthenticated()

    if (!res.success || !res.data) {
      throw new HttpError({
        message: res.message || "Authentication failed. Please log in again.",
        statusCode: res.statusCode || STATUS_CODES.UNAUTHORIZED,
      })
    }

    const { user } = res.data

    const [upcomingBookings, totalBookings, jobApplications, activeApplications, recentBookings, recentApplications] = await Promise.all([
      // Upcoming bookings
      prisma.booking.count({
        where: {
          userId: user.id,
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
          flight: { departureTime: { gte: new Date() } },
        },
      }),

      // Total bookings
      prisma.booking.count({ where: { userId: user.id } }),

      // Job applications
      prisma.jobApplication.count({ where: { userId: user.id } }),

      // Active applications (not rejected/hired)
      prisma.jobApplication.count({
        where: {
          userId: user.id,
          status: {
            in: [ApplicationStatus.PENDING, ApplicationStatus.REVIEWED, ApplicationStatus.SHORTLISTED],
          },
        },
      }),

      // Recent bookings
      prisma.booking.findMany({
        where: { userId: user.id },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          reference: true,
          status: true,
          createdAt: true,
          totalAmount: true,
          flight: {
            select: {
              flightNumber: true,
              departureTime: true,
              departure: { select: { code: true } },
              arrival: { select: { code: true } },
            },
          },
        },
      }),

      // Recent applications
      prisma.jobApplication.findMany({
        where: { userId: user.id },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          createdAt: true,
          opening: { select: { title: true, department: true } },
        },
      }),
    ])

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: "Dashboard overview fetched.",
      data: {
        upcomingBookings,
        totalBookings,
        jobApplications,
        activeApplications,
        recentBookings: recentBookings.map(b => ({
          id: b.id,
          reference: b.reference,
          status: b.status,
          createdAt: b.createdAt,
          flightNumber: b.flight.flightNumber,
          from: b.flight.departure.code,
          to: b.flight.arrival.code,
          departureTime: b.flight.departureTime,
          totalAmount: b.totalAmount,
        })),
        recentApplications: recentApplications.map(a => ({
          id: a.id,
          status: a.status,
          createdAt: a.createdAt,
          openingTitle: a.opening.title,
          openingDepartment: a.opening.department,
        })),
      },
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred.",
    })
  }
}
