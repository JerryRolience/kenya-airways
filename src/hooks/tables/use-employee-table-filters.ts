import { ColumnFiltersState } from "@tanstack/react-table"
import { useTableFilters } from "./use-table-filters"

export function useEmployeeTableFilters(columnFilters: ColumnFiltersState) {
  const filters = useTableFilters(columnFilters, {
    statusColumnId: "isActive",
    multiSelectColumns: ["gender", "bloodGroup"],
  })

  return { status: filters.isActive as boolean | undefined }
}
