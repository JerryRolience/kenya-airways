"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowRight, Briefcase, FileText, Link as LinkIcon, Plus, Ticket, TrendingUp, UserCheck, Users } from "lucide-react"
import Link from "next/link"

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
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of Kenya Airways operations and workforce management.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          subtitle={`${stats.activeEmployees} active`}
          icon={Users}
          trend="+12%"
          trendUp={true}
          href="/admin/employees"
          color="bg-blue-50 text-blue-600 border-blue-200"
        />
        <StatsCard
          title="Job Openings"
          value={stats.totalOpenings}
          subtitle={`${stats.openOpenings} open`}
          icon={Briefcase}
          trend="+3"
          trendUp={true}
          href="/admin/job-openings"
          color="bg-amber-50 text-amber-600 border-amber-200"
        />
        <StatsCard
          title="Successful Matches"
          value={stats.totalMatches}
          subtitle="This month"
          icon={LinkIcon}
          trend="+8"
          trendUp={true}
          href="/admin/matches"
          color="bg-emerald-50 text-emerald-600 border-emerald-200"
        />
        <StatsCard
          title="Active Tickets"
          value={stats.totalTickets}
          subtitle="Issued"
          icon={Ticket}
          trend="+1,240"
          trendUp={true}
          href="/admin/tickets"
          color="bg-purple-50 text-purple-600 border-purple-200"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard title="Add Employee" description="Register a new staff member" icon={Plus} href="/admin/employees/new" primary />
          <QuickActionCard title="Create Opening" description="Post a new job position" icon={Briefcase} href="/admin/job-openings/new" />
          <QuickActionCard title="Match Employee" description="Assign staff to a position" icon={UserCheck} href="/admin/matches" />
          <QuickActionCard title="View Reports" description="Generate ticket & match reports" icon={FileText} href="/admin/reports" />
        </div>
      </div>

      {/* Recent Activity + Recent Employees */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Matches */}
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Recent Matches</CardTitle>
            <Link href="/admin/matches/history">
              <Button variant="ghost" size="sm" className="text-xs text-accent">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentMatches.length > 0 ? (
              <div className="space-y-3">
                {stats.recentMatches.map(match => (
                  <div key={match.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {match.employee.firstName} {match.employee.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.employee.position} → {match.opening.title}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                      Active
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <LinkIcon className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">No matches yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Employees */}
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Recent Employees</CardTitle>
            <Link href="/admin/employees">
              <Button variant="ghost" size="sm" className="text-xs text-accent">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentEmployees.length > 0 ? (
              <div className="space-y-3">
                {stats.recentEmployees.map((employee, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {employee.position} · {employee.department}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", employee.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border")}>
                      {employee.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">No employees yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  href,
  color,
}: {
  title: string
  value: number
  subtitle: string
  icon: React.ElementType
  trend: string
  trendUp: boolean
  href: string
  color: string
}) {
  return (
    <Link href={href}>
      <Card className="group border-border/60 bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-elegant cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-foreground font-display">{value.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
          <p className="mt-1 text-xs font-medium text-muted-foreground group-hover:text-accent transition-colors">{title}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

// ─── Quick Action Card ───
function QuickActionCard({ title, description, icon: Icon, href, primary = false }: { title: string; description: string; icon: React.ElementType; href: string; primary?: boolean }) {
  return (
    <Link href={href}>
      <Card className={cn("group border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant cursor-pointer", primary && "border-accent/30 bg-accent/5")}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", primary ? "bg-accent text-accent-foreground" : "bg-muted text-foreground")}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{title}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
