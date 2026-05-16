"use client"

import { DataTableCursorPagination, DataTableEmptyState, DataTableErrorState, DataTableLoadingState } from "@/components/global/data-table-components"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchUserFlights } from "@/hooks/flight/use-fetch-user-flights"
import { useFlightTableFilters } from "@/hooks/tables/use-flight-table"
import { useCursorPagination } from "@/hooks/use-cursor"
import { useDebounce } from "@/hooks/use-debounce"
import { AppError } from "@/lib/app-error"
import { UserFlight } from "@/types/flights"
import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { Plane, RefreshCw } from "lucide-react"
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { flightColumns } from "./flight-columns"
import { FlightTableFilter } from "./flight-table-filters"

export function FlightsTable() {
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [searchInput, setSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined)
  const [, startTransition] = useTransition()

  const debouncedSearch = useDebounce(searchInput, 400)

  const { bookingStatus: bookingStatusFilter } = useFlightTableFilters(columnFilters)

  const { currentCursor, currentPage, hasPreviousPage, goToNextPage, goToPreviousPage, goToFirstPage, reset: resetCursor } = useCursorPagination()

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
    error,
  } = useFetchUserFlights({
    limit: pageSize,
    search: debouncedSearch || undefined,
    cursor: currentCursor,
    upcoming: statusFilter,
    status: bookingStatusFilter,
  })

  // Reset to first page when filters change
  useEffect(() => {
    resetCursor()
  }, [debouncedSearch, statusFilter, bookingStatusFilter, resetCursor])

  const flights: UserFlight[] = response?.success ? (response.data?.data ?? []) : []

  const meta = response?.data?.meta
  const total = meta?.total ?? 0
  const hasNextPage = meta?.hasNextPage ?? false
  const nextCursor = meta?.nextCursor ?? null
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 0

  const handleSearch = useCallback((value: string) => {
    startTransition(() => {
      setSearchInput(value)
    })
  }, [])

  const handleReset = useCallback(() => {
    table.resetColumnFilters()
    setSearchInput("")
    resetCursor()
    setStatusFilter(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetCursor, setStatusFilter])

  const handleNextPage = useCallback(() => {
    goToNextPage(nextCursor)
  }, [goToNextPage, nextCursor])

  const columns = useMemo(() => flightColumns, [])

  const table = useReactTable({
    data: flights,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    enableRowSelection: true,
    manualFiltering: true,
    manualPagination: true,
    pageCount: totalPages,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const isFiltered = columnFilters.length > 0 || searchInput.length > 0 || statusFilter !== undefined
  const selectedCount = table.getFilteredSelectedRowModel().rows.length

  const errorMessage = error instanceof AppError ? error.message : "We couldn't load the flight list. Check your connection and try again."

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader className="pb-0 px-3 sm:px-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-base font-semibold">Flight Registry</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isLoading ? "Loading flight..." : total > 0 ? `${total.toLocaleString()} flight${total === 1 ? "" : "s"} registered` : "No flights registered yet"}
            </p>
          </div>

          {isFetching && !isLoading && (
            <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 ">
              <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground " />
              <span className="text-xs text-muted-foreground">Syncing</span>
            </div>
          )}
        </div>

        <FlightTableFilter
          table={table}
          searchInput={searchInput}
          handleSearch={handleSearch}
          isFiltered={isFiltered}
          handleReset={handleReset}
          refetch={refetch}
          isFetching={isFetching}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
      </CardHeader>

      <CardContent className="px-0 sm:px-6 pt-4 space-y-3">
        {/* Table content remains the same */}
        <div className="rounded-md border">
          <div className="relative w-full overflow-x-auto">
            <div className="max-w-120 lg:min-w-full">
              <Table className="w-full table-auto">
                <TableHeader>
                  {table.getHeaderGroups().map(hg => (
                    <TableRow key={hg.id} className="bg-muted/30 hover:bg-muted/30">
                      {hg.headers.map(header => (
                        <TableHead key={header.id} className="whitespace-nowrap text-xs h-10 px-2 sm:px-3">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                {isLoading ? (
                  <DataTableLoadingState columns={flightColumns} rows={10} />
                ) : isError ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={flightColumns.length}>
                        <DataTableErrorState onRetry={() => refetch()} message={errorMessage} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : table.getRowModel().rows.length ? (
                  <TableBody>
                    {table.getRowModel().rows.map(row => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/40 transition-colors">
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id} className="text-xs sm:text-sm whitespace-nowrap py-2.5 px-2 sm:px-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                ) : (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={flightColumns.length}>
                        <DataTableEmptyState
                          icon={Plane}
                          title={isFiltered ? "No matching flights" : "No flights yet"}
                          description={isFiltered ? "Try adjusting your search or clearing your filters." : "Register your first flight using the Add Flight button above."}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </div>
          </div>
        </div>

        <div className="px-3 sm:px-0">
          <DataTableCursorPagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
            setPageSize={setPageSize}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            isFetching={isFetching}
            selectedCount={selectedCount}
            onNextPage={handleNextPage}
            onPreviousPage={goToPreviousPage}
            onFirstPage={goToFirstPage}
          />
        </div>
      </CardContent>
    </Card>
  )
}
