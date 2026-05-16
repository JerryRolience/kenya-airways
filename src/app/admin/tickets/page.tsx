// app/(admin)/admin/tickets/page.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchTicketReport } from "@/hooks/report/use-fetch-ticket-report"
import { AppError } from "@/lib/app-error"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { AlertCircle, DollarSign, Printer, RefreshCw, Search, Ticket, TrendingUp, Users } from "lucide-react"
import { useState } from "react"

const CLASS_OPTIONS = [
  { value: "all", label: "All Classes" },
  { value: "EXECUTIVE", label: "Executive" },
  { value: "MIDDLE", label: "Middle" },
  { value: "ECONOMY", label: "Economy" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "USED", label: "Used" },
  { value: "CANCELLED", label: "Cancelled" },
]

const CLASS_STYLES: Record<string, string> = {
  EXECUTIVE: "bg-amber-100 text-amber-700 border-amber-200",
  MIDDLE: "bg-blue-100 text-blue-700 border-blue-200",
  ECONOMY: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  USED: "bg-muted text-muted-foreground border-border",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
}

export default function TicketReportPage() {
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const {
    data: response,
    isLoading,
    isError,
    isFetching,
    refetch,
    error,
  } = useFetchTicketReport({
    search: search || undefined,
    class: classFilter !== "all" ? classFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  })

  const reportData = response?.data
  const tickets = reportData?.tickets ?? []

  const errorMessage = error instanceof AppError ? error.message : "Failed to load ticket report."

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 py-3 sm:py-4 w-full min-w-0">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Ticket Report</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">View and print all issued tickets</p>
        </div>

        <div className="self-start sm:self-auto shrink-0 gap-2 flex flex-col sm:flex-row no-print">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs hover:cursor-pointer" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" className="h-8 gap-1.5 text-xs hover:cursor-pointer" onClick={handlePrint}>
            <Printer className="h-3.5 w-3.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsMiniCard title="Total Tickets" value={reportData?.totalTickets ?? 0} icon={Ticket} bgColor="bg-blue-50 border-blue-200" />
        <StatsMiniCard title="Total Revenue" value={`KES ${(reportData?.totalRevenue ?? 0).toLocaleString()}`} icon={DollarSign} bgColor="bg-emerald-50 border-emerald-200" />
        <StatsMiniCard title="Active Tickets" value={reportData?.byStatus?.active ?? 0} icon={TrendingUp} bgColor="bg-purple-50 border-purple-200" />
        <StatsMiniCard title="Passengers" value={tickets.length} icon={Users} bgColor="bg-amber-50 border-amber-200" />
      </div>

      {/* Filters */}
      <Card className="border-border/60 no-print">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by ticket #, passenger, flight..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm" />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="h-9 w-full sm:w-40 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASS_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-full sm:w-40 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="rounded-md">
            <div className="relative w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs h-10">Ticket #</TableHead>
                    <TableHead className="text-xs h-10">Passenger</TableHead>
                    <TableHead className="text-xs h-10">Flight</TableHead>
                    <TableHead className="text-xs h-10">Route</TableHead>
                    <TableHead className="text-xs h-10">Date</TableHead>
                    <TableHead className="text-xs h-10">Seat</TableHead>
                    <TableHead className="text-xs h-10">Class</TableHead>
                    <TableHead className="text-xs h-10">Price</TableHead>
                    <TableHead className="text-xs h-10">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 9 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <div className="text-center py-8">
                          <AlertCircle className="h-8 w-8 text-destructive/60 mx-auto" />
                          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
                          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3 rounded-xl text-xs">
                            Retry
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : tickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <div className="text-center py-8">
                          <Ticket className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                          <p className="mt-2 text-sm text-muted-foreground">No tickets found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    tickets.map(ticket => (
                      <TableRow key={ticket.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="text-xs font-mono">{ticket.ticketNumber}</TableCell>
                        <TableCell className="text-xs">
                          <p className="font-medium">{ticket.passengerName}</p>
                          <p className="text-muted-foreground">{ticket.passengerEmail}</p>
                        </TableCell>
                        <TableCell className="text-xs font-medium">{ticket.flightNumber}</TableCell>
                        <TableCell className="text-xs">
                          {ticket.from} → {ticket.to}
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{format(new Date(ticket.departureTime), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-xs">{ticket.seatNumber || "—"}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className={cn("text-[10px]", CLASS_STYLES[ticket.class] || "")}>
                            {ticket.class}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-medium">KES {ticket.priceKES.toLocaleString()}</TableCell>
                        <TableCell className="text-xs">
                          <Badge variant="outline" className={cn("text-[10px]", STATUS_STYLES[ticket.status] || "")}>
                            {ticket.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsMiniCard({ title, value, icon: Icon, bgColor }: { title: string; value: string | number; icon: React.ElementType; bgColor: string }) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", bgColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-lg font-bold text-foreground font-display">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
