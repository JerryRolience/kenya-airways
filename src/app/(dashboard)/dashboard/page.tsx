"use client"

import { StatsCard } from "@/components/global/stats-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFetchDashboardOverview } from "@/hooks/user-dashboard/use-fetch-user-dashboard-overview"
import { AppError } from "@/lib/app-error"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ArrowRight, Briefcase, Plane, Ticket } from "lucide-react"
import Link from "next/link"

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  COMPLETED: "bg-muted text-muted-foreground border-border",
}

const APP_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  REVIEWED: "bg-blue-100 text-blue-700 border-blue-200",
  SHORTLISTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REJECTED: "bg-muted text-muted-foreground border-border",
}

export default function DashboardOverviewPage() {
  const { statsData, recentBookings, recentApplications, isLoading, isError, error, refetch, isFetching } = useFetchDashboardOverview()

  const errorMessage = error instanceof AppError ? error.message : "We couldn't load your dashboard."

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back! Here&apos;s an overview of your account.</p>
      </div>

      {/* Stats */}
      <StatsCard statsData={statsData} isLoading={isLoading || isFetching} isError={isError} onRetry={refetch} message={errorMessage} />

      {/* Recent Bookings + Applications */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Recent Bookings</CardTitle>
            <Link href="/dashboard/bookings">
              <Button variant="ghost" size="sm" className="text-xs text-accent hover:cursor-pointer">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">No bookings yet</p>
                <Link href="/#booking-card">
                  <Button variant="outline" size="sm" className="mt-3 rounded-xl text-xs">
                    Book a flight
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map(booking => (
                  <div key={booking.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Plane className="h-4 w-4 -rotate-45" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{booking.flightNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.from} → {booking.to} · {format(new Date(booking.departureTime), "MMM d")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLES[booking.status] || "")}>
                        {booking.status}
                      </Badge>
                      <p className="text-xs font-medium text-foreground mt-1">KES {booking.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">Recent Applications</CardTitle>
            <Link href="/dashboard/applications">
              <Button variant="ghost" size="sm" className="text-xs text-accent hover:cursor-pointer">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="mt-2 text-sm text-muted-foreground">No applications yet</p>
                <Link href="/careers">
                  <Button variant="outline" size="sm" className="mt-3 rounded-xl text-xs">
                    Browse careers
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentApplications.map(app => (
                  <div key={app.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{app.openingTitle}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.openingDepartment} · {format(new Date(app.createdAt), "MMM d")}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px]", APP_STATUS_STYLES[app.status] || "")}>
                      {app.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
