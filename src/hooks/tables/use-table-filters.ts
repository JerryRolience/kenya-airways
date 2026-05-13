import { useMemo, useCallback } from "react"
import { ColumnFiltersState } from "@tanstack/react-table"

interface UseTableFiltersOptions {
  statusColumnId?: string
  multiSelectColumns?: string[]
}

export function useTableFilters(columnFilters: ColumnFiltersState, options: UseTableFiltersOptions = {}) {
  const { statusColumnId = "isActive", multiSelectColumns = [] } = options

  const getFilterValue = useCallback(
    (columnId: string) => {
      const filter = columnFilters.find(f => f.id === columnId)
      return filter?.value as string | string[] | undefined
    },
    [columnFilters],
  )

  const extractMultiSelectFilter = useCallback(
    (columnId: string) => {
      const value = getFilterValue(columnId)
      if (!value) return undefined
      return Array.isArray(value) ? value : [value]
    },
    [getFilterValue],
  )

  const extractSingleSelectFilter = useCallback(
    (columnId: string) => {
      const value = getFilterValue(columnId)
      if (!value) return undefined
      const singleValue = Array.isArray(value) ? value[0] : value
      if (singleValue === "true") return true
      if (singleValue === "false") return false
      return singleValue
    },
    [getFilterValue],
  )

  const filters = useMemo(() => {
    const result: Record<string, any> = {
      getFilterValue,
      extractMultiSelectFilter,
      extractSingleSelectFilter,
    }

    // Add status filter
    result[statusColumnId] = extractSingleSelectFilter(statusColumnId)

    // Add multi-select filters
    multiSelectColumns.forEach(col => {
      result[col] = extractMultiSelectFilter(col)
    })

    return result
  }, [statusColumnId, multiSelectColumns, extractSingleSelectFilter, extractMultiSelectFilter, getFilterValue])

  return filters
}
