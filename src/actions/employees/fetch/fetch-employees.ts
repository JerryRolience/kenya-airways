"use server"

import { isUserAuthenticated } from "@/actions/auth/is-user-authenticated"
import { buildPaginatedResult } from "@/actions/lib/pagination"
import { STATUS_CODES } from "@/constants/status-codes"
import { errorResponse, HttpError, successResponse } from "@/lib"
import prisma from "@/lib/prisma"
import { Prisma } from "../../../../generated/prisma/client"
import { FetchEmployeesInput, FetchEmployeesSchema } from "@/validators/employee"
import { EmployeeListItem, FetchEmployeesResponse } from "@/types/employee"

export async function fetchEmployees(input: FetchEmployeesInput = { limit: 10 }): Promise<FetchEmployeesResponse> {
  try {
    //  1. Validate input
    const validated = FetchEmployeesSchema.parse(input)
    const { cursor, limit, search, isActive } = validated

    //  2. Authentication
    const res = await isUserAuthenticated()

    if (!res.success || !res.data?.user) {
      throw new HttpError({ statusCode: STATUS_CODES.UNAUTHORIZED, message: "Access denied. You must be authenticated to view employees." })
    }

    //  3. Build where clause
    // Search across employeeNo, firstName, lastName, phone , email
    const searchFilter: Prisma.EmployeeWhereInput = search
      ? {
          OR: [
            { employeeNo: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}

    const where: Prisma.EmployeeWhereInput = {
      ...(isActive !== undefined && { isActive }),
      ...searchFilter,
    }

    const isFiltered = !!search || isActive !== undefined

    //  4. Run count + fetch in parallel
    // We fetch limit + 1 to detect if a next page exists
    // Count uses same where clause so total reflects filters
    const [total, items] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        take: limit + 1, // fetch one extra to detect next page
        ...(cursor && {
          cursor: { id: cursor },
          skip: 1, // skip the cursor item itself
        }),
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        select: {
          id: true,
          userId: true,
          employeeNo: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          department: true,
          position: true,
          isActive: true,
          createdAt: true,
          user: { select: { role: true } },
        },
      }),
    ])

    //  5. Empty state — no employees in system at all
    if (total === 0 && !search && !isFiltered) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: "No employees have been registered in the system yet.",
        data: buildPaginatedResult<EmployeeListItem>({ items: [], total: 0, limit, isFiltered, search }),
      })
    }

    //  6. Empty state — filters returned nothing
    if (total === 0) {
      return successResponse({
        statusCode: STATUS_CODES.OK,
        message: search
          ? `No employees found matching "${search}". Try a different name, email, phone number, or employee number.`
          : "No employees match the selected filters. Try adjusting your filtering criteria.",
        data: buildPaginatedResult<EmployeeListItem>({ items: [], total: 0, limit, isFiltered, search }),
      })
    }

    //  7. Build paginated result
    const paginated = buildPaginatedResult<EmployeeListItem>({
      items: items.map(emp => {
        return { ...emp, role: emp.user?.role }
      }),
      total,
      limit,
      isFiltered,
      search,
    })

    return successResponse({
      statusCode: STATUS_CODES.OK,
      message: paginated.meta.isFiltered ? `Found ${total} employee${total === 1 ? "" : "s"} matching your search.` : `Showing ${paginated.data.length} of ${total} employee${total === 1 ? "" : "s"}.`,
      data: paginated,
    })
  } catch (error: any) {
    return errorResponse({
      statusCode: error.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: error.name || "Unknown Error",
      message: error.message || "An error occurred while fetching employees. Please try again.",
    })
  }
}
