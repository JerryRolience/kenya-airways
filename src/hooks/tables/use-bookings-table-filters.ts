import { ColumnFiltersState } from "@tanstack/react-table"
import { useTableFilters } from "./use-table-filters"
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums"

export function useBookingsTableFilters(columnFilters: ColumnFiltersState) {
  const filters = useTableFilters(columnFilters, {
    statusColumnId: "status",
    multiSelectColumns: ["paymentStatus"],
  })

  return { status: filters.status as BookingStatus[] | undefined, paymentStatuses: filters.paymentStatus as PaymentStatus[] | undefined }
}
