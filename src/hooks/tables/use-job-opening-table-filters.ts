import { ColumnFiltersState } from "@tanstack/react-table"
import { useTableFilters } from "./use-table-filters"

export function useJobOpeningTableFilters(columnFilters: ColumnFiltersState) {
  const filters = useTableFilters(columnFilters, {
    statusColumnId: "isOpen",
  })

  return { status: filters.isOpen as boolean | undefined }
}
