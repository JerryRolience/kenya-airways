"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { ApiResponse } from "@/types/api-response"
import { CreateEmployeeInputData } from "@/types/employee"
import { CreateEmployeeSchema } from "@/validators/employee"
import { generateCode } from "../../lib/generate-codes"
import { Role } from "../../../../generated/prisma/enums"

const EMPLOYEE_PREFIX = "EMP"

export async function createEmployee(data: CreateEmployeeInputData): Promise<ApiResponse> {
  try {
    return await prisma.$transaction(async tx => {
      const validatedData = CreateEmployeeSchema.parse(data)
      //  1. Authenticate the user and check if they have the necessary permissions to create an employee.
      const res = await isUserAuthenticated()

      if (!res.success || !res.data?.user) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You must be authenticated to create an employee.",
        })
      }

      // Only admins can create employees, so we check if the authenticated user is an admin before proceeding with employee creation.
      if (!res.data?.isAdmin) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message:
            "Access denied. You are not authorized to perform this action and therefore cannot proceed with creating an employee. Please contact your administrator if you believe this is an error or if you require access to this functionality.",
        })
      }

      // If the employee being created is an admin, we also check if the authenticated user is a super admin to ensure that only super admins can create other admins.
      if (validatedData.role === Role.ADMIN && res.data?.user.role !== Role.SUPER_ADMIN) {
        throw new HttpError({
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: "Access denied. You are not authorized to create employees with the ADMIN role.Only SUPER ADMIN users can create employees with elevated privileges.",
        })
      }

      // If the employee being created is a super admin, we throw an error to prevent the creation of super admin accounts. he super admin cannot be created
      if (validatedData.role === Role.SUPER_ADMIN) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "Invalid role. The SUPER ADMIN role cannot be assigned to an employee. Please select a valid role for the employee.",
        })
      }

      // 2. Check if a user with the provided email already exists and if they already have an employee profile. This ensures that we don't create duplicate employee profiles for the same user and that every employee is associated with a valid user account.
      const existingUser = await tx.user.findUnique({
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

      if (!existingUser) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "No user found with the provided email address. Please ensure the email is correct and that the user has registered an account before creating an employee profile.",
        })
      }

      if (existingUser.employee) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "An employee profile already exists for the provided email address. Please check the email and try again or contact support if you believe this is an error.",
        })
      }

      if (existingUser.role !== Role.PASSENGER) {
        throw new HttpError({
          statusCode: STATUS_CODES.BAD_REQUEST,
          message: "Only passengers can be registered as employees. Please ensure the user has the correct role before proceeding.",
        })
      }

      // 3. Generate the employee number.
      const employeeNo = await generateCode(tx, EMPLOYEE_PREFIX)

      // 4. Create the employee profile in the database, associating it with the existing user account.
      const employee = await tx.employee.create({
        data: {
          employeeNo,
          user: { connect: { id: existingUser.id } },
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          phone: existingUser.phone,
          isActive: validatedData.isActive ?? true, // Default to active if not provided
          email: validatedData.email,
          position: validatedData.position,
          department: validatedData.department,
        },
        select: { id: true, firstName: true, lastName: true },
      })

      if (!employee) {
        throw new HttpError({
          statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
          message: "An error occurred while registering the employee. Please try again later or contact support if the issue persists.",
        })
      }

      // 5. Update the user's role to match the employee's role, ensuring that their permissions align with their new employee status.
      await tx.user.update({ where: { id: existingUser.id }, data: { role: validatedData.role } })

      return successResponse({
        statusCode: STATUS_CODES.CREATED,
        message: `You have successfully registered ${employee.firstName} ${employee.lastName} as an employee in the system.`,
      })
    })
  } catch (error: any) {
    // Prisma re-throws as PrismaClientKnownRequestError in transactions
    // but HttpError thrown inside will still be the cause — unwrap it
    const resolved = error?.cause instanceof HttpError ? error.cause : error

    // console.log("ERROR ADDING AN EMPLOYEE", resolved)

    return errorResponse({
      statusCode: resolved.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: resolved.name || "Unknown Error",
      message: resolved.message || "An error occurred while creating the employee.",
    })
  }
}
