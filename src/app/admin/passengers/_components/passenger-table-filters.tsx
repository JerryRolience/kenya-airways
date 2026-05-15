"use client"

import { DataTableFacetedFilter, DataTableViewOptions } from "@/components/global/data-table-components"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NATIONALITY_OPTIONS } from "@/constants/auth"
import { PassengerListItem } from "@/types/passenger"
import { Table } from "@tanstack/react-table"
import { Search, X, RefreshCw } from "lucide-react"

const ACCOUNT_OPTIONS = [
  { value: "true", label: "Registered" },
  { value: "false", label: "Guest" },
]

interface PassengerTableFilterProps {
  table: Table<PassengerListItem>
  searchInput: string
  handleSearch: (value: string) => void
  isFiltered: boolean
  handleReset: () => void
  refetch: () => void
  isFetching: boolean
}

export function PassengerTableFilter({ table, searchInput, handleSearch, isFiltered, handleReset, refetch, isFetching }: PassengerTableFilterProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Left — search + filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, email, passport..." value={searchInput} onChange={e => handleSearch(e.target.value)} className="pl-8 h-8 text-sm" />
        </div>

        {table.getColumn("accountType") && <DataTableFacetedFilter column={table.getColumn("accountType")} title="Account" options={ACCOUNT_OPTIONS} />}
        {table.getColumn("nationality") && <DataTableFacetedFilter column={table.getColumn("nationality")} title="Nationality" options={NATIONALITY_OPTIONS as { value: string; label: string }[]} />}

        {isFiltered && (
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={handleReset}>
            Clear
            <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Right — refresh + view options */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs hover:cursor-pointer" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
          <span className="inline">Refresh</span>
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
