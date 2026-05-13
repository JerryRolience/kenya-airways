"use client"

import { StatsCard } from "@/components/global/stats-card"
import { Briefcase, FileText, Link as LinkIcon, Plus, Ticket, UserCheck, Users } from "lucide-react"
import { QuickActionCard } from "./quick-action-card"
import { RecentEmployees } from "./recent-employees"
import { RecentMatches } from "./recent-matches"

interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  totalOpenings: number
  openOpenings: number
  totalMatches: number
  recentMatches: any[]
  totalTickets: number
  recentEmployees: any[]
}

export function DashboardStats({ stats }: { stats: DashboardStats }) {
  const statsData = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      change: `+${stats.activeEmployees} active`,
      description: "Number of employees in the company",
      icon: Users,
      link: "/admin/employees",
    },
    {
      title: "Job Openings",
      value: stats.totalOpenings,
      change: `+${stats.openOpenings} open`,
      description: "Current job openings available",
      icon: Briefcase,
      link: "/admin/job-openings",
    },
    {
      title: "Successful Matches",
      value: stats.totalMatches,
      change: "+8 this month",
      description: "Employees successfully matched to positions",
      icon: LinkIcon,
      link: "/admin/matches",
    },
    {
      title: "Active Tickets",
      value: stats.totalTickets,
      change: "+1,240 issued",
      description: "Support tickets issued by employees",
      icon: Ticket,
      link: "/admin/tickets",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of Kenya Airways operations and workforce management.</p>
      </div>

      {/* Stats Cards */}
      <StatsCard statsData={statsData} />

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard title="Add Employee" description="Register a new staff member" icon={Plus} href="/admin/employees/#new" primary />
          <QuickActionCard title="Create Opening" description="Post a new job position" icon={Briefcase} href="/admin/job-openings/#new" />
          <QuickActionCard title="Match Employee" description="Assign staff to a position" icon={UserCheck} href="/admin/#matches" />
          <QuickActionCard title="View Reports" description="Generate ticket & match reports" icon={FileText} href="/admin/#reports" />
        </div>
      </div>

      {/* Recent Activity + Recent Employees */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Matches */}
        <RecentMatches matches={stats.recentMatches} />

        {/* Recent Employees */}
        <RecentEmployees employees={stats.recentEmployees} />
      </div>
    </div>
  )
}
