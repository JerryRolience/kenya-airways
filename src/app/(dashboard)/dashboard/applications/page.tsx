"use client"

import { ApplicationsTable } from "@/app/admin/job-openings/applications/_components/applications-table"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"
import Link from "next/link"

export default function MyApplicationsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">My Applications</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Track the status of your job applications</p>
        </div>

        <div className="self-start sm:self-auto shrink-0">
          <Link href="/careers">
            <Button className="btn-primary h-9 gap-2 hover:cursor-pointer">
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Applications table */}
      <ApplicationsTable isUserView={true} />
    </div>
  )
}
