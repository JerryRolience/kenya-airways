"use client"

import { ApplicationsTable } from "./_components/applications-table"

export default function ApplicationsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 py-3 sm:py-4 w-full min-w-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Applications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Review and manage job applications</p>
        </div>
      </div>

      <ApplicationsTable />
    </div>
  )
}
