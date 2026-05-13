import { BuildPaginatedResultParams, PaginatedResult } from "@/types/pagination"

// Call this after any Prisma query to assemble the standard response
export function buildPaginatedResult<T extends { id: string }>({
  items,
  total,
  limit,
  search,
  isFiltered = false,
}: BuildPaginatedResultParams<T>): PaginatedResult<T> {
  const hasNextPage = items.length > limit
  // We fetch limit + 1 to detect if there's a next page
  // If we got more than limit, slice off the extra item
  const data = hasNextPage ? items.slice(0, limit) : items
  const nextCursor = hasNextPage ? data[data.length - 1].id : null

  return {
    data,
    meta: {
      total,
      limit,
      hasNextPage,
      nextCursor,
      isEmpty: total === 0,
      isFiltered: isFiltered || !!search,
    },
  }
}
