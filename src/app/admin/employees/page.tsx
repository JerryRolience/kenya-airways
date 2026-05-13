"use client"

import { AddEmployeeForm } from "@/components/forms/employee-form"
import { StatsCard } from "@/components/global/stats-card"
import { Button } from "@/components/ui/button"
import { useFetchEmployeeStats } from "@/hooks/employee/use-fetch-employee-stats"
import { RefreshCw, UserPlus } from "lucide-react"
import { useState } from "react"
import { EmployeesTable } from "./_components/employees-table"

export default function EmployeesPage() {
  const [addOpen, setAddOpen] = useState(false)

  const { isLoading: statsLoading, statsData, isError, refetch, error, isFetching: statsFetching } = useFetchEmployeeStats()

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 py-3 sm:py-4 w-full min-w-0">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Employees</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Manage and monitor all employee records and activities</p>
        </div>

        <div className="self-start sm:self-auto shrink-0 gap-2 flex flex-col sm:flex-row ">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs hover:cursor-pointer" onClick={() => refetch()} disabled={statsFetching}>
            <RefreshCw className={`h-3.5 w-3.5  ${statsFetching ? "animate-spin" : ""}`} />
            <span className="inline">Refresh Analytics</span>
          </Button>

          <Button className="btn-primary h-9 gap-2 hover:cursor-pointer" onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats  */}
      <StatsCard statsData={statsData} isLoading={statsLoading} isError={isError} onRetry={refetch} message={error?.message ?? "Failed to load statistics."} />

      {/* Employee table */}
      <EmployeesTable />

      {/* Add employee dialog */}
      <AddEmployeeForm open={addOpen} setOpen={setAddOpen} />
    </div>
  )
}
