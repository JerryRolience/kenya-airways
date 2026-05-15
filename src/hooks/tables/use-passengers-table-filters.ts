import { ColumnFiltersState } from "@tanstack/react-table"
import { useTableFilters } from "./use-table-filters"

export function usePassengersTableFilters(columnFilters: ColumnFiltersState) {
  const filters = useTableFilters(columnFilters, {
    statusColumnId: "accountType",
    multiSelectColumns: ["nationality"],
  })

  return { status: filters.accountType as boolean | undefined, nationalities: filters.nationality as string[] | undefined }
}
