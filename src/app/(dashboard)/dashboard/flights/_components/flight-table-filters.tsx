"use client"

import { DataTableFacetedFilter, DataTableViewOptions } from "@/components/global/data-table-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserFlight } from "@/types/flights"
import { Table } from "@tanstack/react-table"
import { Search, X, RefreshCw } from "lucide-react"
import { BookingStatus } from "../../../../../../generated/prisma/enums"
import { formatEnumValue } from "@/utils/format-enums"

const STATUS_OPTIONS = Object.values(BookingStatus).map(status => ({
  value: status,
  label: formatEnumValue(status),
}))

interface FlightTableFilterProps {
  table: Table<UserFlight>
  searchInput: string
  handleSearch: (value: string) => void
  isFiltered: boolean
  handleReset: () => void
  refetch: () => void
  isFetching: boolean
  statusFilter: boolean | undefined
  setStatusFilter: (value: boolean | undefined) => void
}

export function FlightTableFilter({ table, searchInput, handleSearch, isFiltered, handleReset, refetch, isFetching, statusFilter, setStatusFilter }: FlightTableFilterProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Left — search + filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by flight, city, ref..." value={searchInput} onChange={e => handleSearch(e.target.value)} className="pl-8 h-9 text-sm rounded-xl" />
        </div>

        {table.getColumn("bookingStatus") && <DataTableFacetedFilter column={table.getColumn("bookingStatus")} title="Status" options={STATUS_OPTIONS} />}

        <Select
          value={statusFilter === undefined ? "all" : statusFilter ? "upcoming" : "past"}
          onValueChange={value => {
            if (value === "all") {
              setStatusFilter(undefined)
            } else if (value === "upcoming") {
              setStatusFilter(true)
            } else if (value === "past") {
              setStatusFilter(false)
            }
          }}
        >
          <SelectTrigger className="h-9 w-32.5 rounded-xl text-sm">
            <SelectValue placeholder="All flights" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Flights</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button variant="ghost" size="sm" className="h-9 px-2 text-xs rounded-xl hover:cursor-pointer" onClick={handleReset}>
            Clear
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Right — refresh + view options */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs hover:cursor-pointer rounded-xl" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span className="inline">Refresh</span>
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
