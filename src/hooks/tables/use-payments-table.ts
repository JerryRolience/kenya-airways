import { ColumnFiltersState } from "@tanstack/react-table"
import { useTableFilters } from "./use-table-filters"
import { PaymentMethod } from "../../../generated/prisma/enums"

export function usePaymentsTableFilters(columnFilters: ColumnFiltersState) {
  const filters = useTableFilters(columnFilters, {
    multiSelectColumns: ["method"],
  })

  return { methods: filters.method as PaymentMethod[] | undefined }
}
