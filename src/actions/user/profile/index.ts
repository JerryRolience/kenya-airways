"use server"

import { auth } from "@clerk/nextjs/server"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { PassengerRelation } from "../../../../generated/prisma/enums"
import { ProfileResponse } from "@/types/profile"

export async function fetchProfile(): Promise<ProfileResponse> {
  try {
    const { userId } = await auth()

    if (!userId) {
      throw new HttpError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        message: "You must be signed in. Please sign in to view your profile.",
      })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,
        passengers: {
          where: { relationship: PassengerRelation.SELF },
          select: {
            id: true,
            title: true,
            passportNumber: true,
            nationality: true,
            dateOfBirth: true,
          },
          take: 1,
        },
        employee: {
          select: {
            id: true,
            employeeNo: true,
            department: true,
            position: true,
            isActive: true,
          },
        },
        _count: { select: { bookings: true } },
      },
    })

    if (!user) {
      throw new HttpError({
        statusCode: STATUS_CODES.NOT_FOUND,
        message: "User account not found. Please contact support if you believe this is an error.",
      })
    }

    const [totalApplications, totalPayments] = await Promise.all([
      // Get application count
      prisma.jobApplication.count({ where: { userId: user.id } }),

      // Get payment count
      prisma.payment.count({ where: { booking: { userId: user.id } } }),
    ])

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: "Profile fetched successfully.",
      data: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        isActive: true,
        createdAt: user.createdAt,
        passenger: user.passengers[0],
        employee: user.employee || null,
        totalBookings: user._count.bookings,
        totalApplications,
        totalPayments,
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
