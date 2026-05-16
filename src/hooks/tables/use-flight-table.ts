import { ColumnFiltersState } from "@tanstack/react-table"
import { BookingStatus } from "../../../generated/prisma/enums"
import { useTableFilters } from "./use-table-filters"

export function useFlightTableFilters(columnFilters: ColumnFiltersState) {
  const filters = useTableFilters(columnFilters, {
    multiSelectColumns: ["bookingStatus"],
  })

  return { bookingStatus: filters.bookingStatus as BookingStatus[] | undefined }
}
