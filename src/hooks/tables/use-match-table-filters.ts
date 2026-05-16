import { ColumnFiltersState } from "@tanstack/react-table"
import { useTableFilters } from "./use-table-filters"

export function useMatchTableFilters(columnFilters: ColumnFiltersState) {
  const filters = useTableFilters(columnFilters, {
    statusColumnId: "openingStatus",
  })

  return { status: filters.openingStatus as boolean | undefined }
}
