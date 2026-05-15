"use client"

import { StatsCard } from "@/components/global/stats-card"
import { Briefcase, FileText, Plus, UserCheck } from "lucide-react"
import { QuickActionCard } from "./quick-action-card"
import { RecentEmployees } from "./recent-employees"
import { RecentMatches } from "./recent-matches"
import { AppError } from "@/lib/app-error"
import { useFetchDashboardData } from "@/hooks/dashboard/use-fetch-dashboard-data"

export function DashboardPage() {
  const { statsData, recentMatches, recentEmployees, isLoading, isError, error, refetch, isFetching } = useFetchDashboardData()

  const errorMessage = error instanceof AppError ? error.message : "We couldn't load the dashboard data. Please try again."

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of Kenya Airways operations and workforce management.</p>
      </div>

      {/* Stats Cards */}
      <StatsCard statsData={statsData} isLoading={isLoading} isError={isError} onRetry={refetch} message={errorMessage} />

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard title="Add Employee" description="Register a new staff member" icon={Plus} href="/admin/employees" primary />
          <QuickActionCard title="Create Opening" description="Post a new job position" icon={Briefcase} href="/admin/job-openings" />
          <QuickActionCard title="Match Employee" description="Assign staff to a position" icon={UserCheck} href="/admin/matches" />
          <QuickActionCard title="View Reports" description="Generate ticket & match reports" icon={FileText} href="/admin/reports" />
        </div>
      </div>

      {/* Recent Activity + Recent Employees */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Matches */}
        <RecentMatches matches={recentMatches} isLoading={isLoading} isError={isError} errorMessage={errorMessage} onRetry={refetch} isFetching={isFetching} />

        {/* Recent Employees */}
        <RecentEmployees employees={recentEmployees} isLoading={isLoading} isError={isError} errorMessage={errorMessage} onRetry={refetch} isFetching={isFetching} />
      </div>
    </div>
  )
}
