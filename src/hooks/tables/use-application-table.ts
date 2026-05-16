import { ColumnFiltersState } from "@tanstack/react-table"
import { useTableFilters } from "./use-table-filters"
import { ApplicationStatus } from "../../../generated/prisma/enums"

export function useApplicationTableFilters(columnFilters: ColumnFiltersState) {
  const filters = useTableFilters(columnFilters, {
    multiSelectColumns: ["openingId", "status"],
  })

  return { status: filters.status as ApplicationStatus[] | undefined, openingIds: filters.openingId as string[] | undefined }
}
