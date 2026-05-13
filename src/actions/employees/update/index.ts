"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { UpdateEmployeeInputData } from "@/types/employee"
import { UpdateEmployeeSchema } from "@/validators/employee"
import { Role } from "../../../../generated/prisma/enums"

export async function updateEmployee(data: UpdateEmployeeInputData): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedData = UpdateEmployeeSchema.parse(data)

      // 1. Authenticate user
      const res = await isUserAuthenticated()

      if (!res.success || !res.data?.user) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You must be authenticated to update an employee.",
        })
      }

      // 2. Find the existing employee record
      const existingEmployee = await tx.employee.findUnique({
        where: { id: validatedData.id },
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true },
          },
        },
      })

      if (!existingEmployee) {
        throw new HttpError({
          statusCode: STATUS_CODES.NOT_FOUND,
          message: "Employee not found. Please check the employee details and try again.",
        })
      }

      // Guard: Employee must be linked to a user
      if (!existingEmployee.user) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "This employee is not linked to any user account. Please contact support.",
        })
      }

      const currentUser = existingEmployee.user
      const isSelfUpdate = currentUser.id === res.data?.user.id
      const isAdmin = res.data?.isAdmin

      // 3. Authorization
      if (!isSelfUpdate && !isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You can only update your own profile.",
        })
      }

      // 4. SUPER_ADMIN protection
      if (currentUser.role === Role.SUPER_ADMIN && res.data?.user.role !== Role.SUPER_ADMIN) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "You cannot modify a Super Admin's profile.",
        })
      }

      // 5. Separate self-service fields from admin-only fields
      const isChangingAdminFields = validatedData.department !== undefined || validatedData.position !== undefined || validatedData.isActive !== undefined || validatedData.role !== undefined

      // Self-update: only allow name, email, phone
      if (isSelfUpdate && !isAdmin && isChangingAdminFields) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "You can only update your name, email, and phone number. Contact an administrator to change your department, position, or role.",
        })
      }

      // 6. Email change logic
      let targetUserId = existingEmployee.userId
      let firstName = existingEmployee.firstName
      let lastName = existingEmployee.lastName
      let phone = existingEmployee.phone

      if (validatedData.email && validatedData.email !== currentUser.email) {
        // Only admins can change to a different user's email
        if (isSelfUpdate && !isAdmin) {
          // Self-update: update both employee.email and user.email
          await tx.user.update({
            where: { id: currentUser.id },
            data: { email: validatedData.email },
          })
        } else {
          // Admin changing linked user
          const newUser = await tx.user.findUnique({
            where: { email: validatedData.email },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              role: true,
              employee: { select: { id: true } },
            },
          })

          if (!newUser) {
            throw new HttpError({
              statusCode: STATUS_CODES.BAD_REQUEST,
              message: "No user found with this email. The user must register first.",
            })
          }

          if (newUser.employee && newUser.employee.id !== validatedData.id) {
            throw new HttpError({
              statusCode: STATUS_CODES.BAD_REQUEST,
              message: "This user already has a different employee profile.",
            })
          }

          if (newUser.role !== Role.PASSENGER) {
            throw new HttpError({
              statusCode: STATUS_CODES.BAD_REQUEST,
              message: "This user already has a staff role.",
            })
          }

          targetUserId = newUser.id
          firstName = newUser.firstName
          lastName = newUser.lastName
          phone = newUser.phone || phone
        }
      }

      // 7. Role change authorization (admin only)
      if (validatedData.role) {
        if (validatedData.role === Role.SUPER_ADMIN) {
          throw new HttpError({
            statusCode: STATUS_CODES.BAD_REQUEST,
            message: "The SUPER ADMIN role cannot be assigned through this interface.",
          })
        }

        if (validatedData.role === Role.ADMIN && currentUser.role !== Role.ADMIN && res.data?.user.role !== Role.SUPER_ADMIN) {
          throw new HttpError({
            statusCode: STATUS_CODES.UNAUTHORIZED,
            message: "Only a Super Admin can promote an employee to the ADMIN role.",
          })
        }

        if (currentUser.role === Role.ADMIN && validatedData.role === Role.EMPLOYEE && res.data?.user.role !== Role.SUPER_ADMIN) {
          throw new HttpError({
            statusCode: STATUS_CODES.UNAUTHORIZED,
            message: "Only a Super Admin can demote an admin to employee.",
          })
        }
      }

      // 8. Build update data
      const updateData: any = {}

      // Admin-only fields
      if (isAdmin) {
        if (validatedData.department !== undefined) updateData.department = validatedData.department
        if (validatedData.position !== undefined) updateData.position = validatedData.position
        if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive
      }

      // Name/phone updates (both self and admin)
      if (validatedData.firstName !== undefined) updateData.firstName = validatedData.firstName
      if (validatedData.lastName !== undefined) updateData.lastName = validatedData.lastName
      if (validatedData.phone !== undefined) updateData.phone = validatedData.phone

      // If email changed
      if (validatedData.email !== undefined) updateData.email = validatedData.email

      // If admin changed the linked user
      if (targetUserId !== existingEmployee.userId) {
        updateData.userId = targetUserId
        updateData.firstName = firstName
        updateData.lastName = lastName
        updateData.phone = phone
      }

      // 9. Update employee record
      const updatedEmployee = await tx.employee.update({
        where: { id: validatedData.id },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          employeeNo: true,
          department: true,
          position: true,
          isActive: true,
        },
      })

      // 10. Handle role changes on user record (admin only)
      if (validatedData.role && validatedData.role !== currentUser.role) {
        if (existingEmployee.userId && targetUserId !== existingEmployee.userId) {
          await tx.user.update({
            where: { id: existingEmployee.userId },
            data: { role: Role.PASSENGER },
          })
        }

        if (targetUserId) {
          await tx.user.update({
            where: { id: targetUserId },
            data: { role: validatedData.role },
          })
        }
      }

      // 11. Also update user's name/phone if self-update
      if (isSelfUpdate) {
        const userUpdates: any = {}
        if (validatedData.firstName !== undefined) userUpdates.firstName = validatedData.firstName
        if (validatedData.lastName !== undefined) userUpdates.lastName = validatedData.lastName
        if (validatedData.phone !== undefined) userUpdates.phone = validatedData.phone

        if (Object.keys(userUpdates).length > 0) {
          await tx.user.update({
            where: { id: currentUser.id },
            data: userUpdates,
          })
        }
      }

      // 12. Build success message
      const changes: string[] = []
      if (validatedData.firstName || validatedData.lastName) changes.push("name")
      if (validatedData.phone) changes.push("phone")
      if (validatedData.email) changes.push("email")
      if (validatedData.department) changes.push("department")
      if (validatedData.position) changes.push("position")
      if (validatedData.role && validatedData.role !== currentUser.role) changes.push("role")
      if (validatedData.isActive !== undefined) changes.push("status")

      const changeText = changes.length > 0 ? `Updated ${changes.join(", ")}` : "No changes were made"

      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: `${changeText} for ${updatedEmployee.firstName} ${updatedEmployee.lastName} (${updatedEmployee.employeeNo}).`,
      })
    })
  } catch (error: any) {
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while updating the employee.",
    })
  }
}
