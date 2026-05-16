"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AppError } from "@/lib/app-error"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { AlertCircle, Link as LinkIcon, Printer, RefreshCw } from "lucide-react"

import { useFetchMatchesReport } from "@/hooks/report/use-fetch-matches-report"
export default function MatchesReportPage() {
  const { data: response, isLoading, isError, isFetching, refetch, error } = useFetchMatchesReport()

  const reportData = response?.data
  const matches = reportData?.matches ?? []

  const errorMessage = error instanceof AppError ? error.message : "Failed to load matches report."

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-4 py-3 sm:py-4 w-full min-w-0">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Successful Matches Report</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Overview of all employee-to-opening matches</p>
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

      {/* Department Distribution */}
      {reportData?.byDepartment && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Matches by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(reportData.byDepartment).map(([dept, count]) => (
                <div key={dept} className="rounded-xl border border-border/60 bg-muted/20 p-3 text-center">
                  <p className="text-lg font-bold text-foreground font-display">{count}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{dept.replace(/([A-Z])/g, " $1").trim()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matches Table */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">All Matches ({reportData?.totalMatches ?? 0})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md">
            <div className="relative w-full overflow-x-auto print-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs h-10">#</TableHead>
                    <TableHead className="text-xs h-10">Employee</TableHead>
                    <TableHead className="text-xs h-10">Employee No</TableHead>
                    <TableHead className="text-xs h-10">Position</TableHead>
                    <TableHead className="text-xs h-10">Opening</TableHead>
                    <TableHead className="text-xs h-10">Department</TableHead>
                    <TableHead className="text-xs h-10">Opening Status</TableHead>
                    <TableHead className="text-xs h-10">Matched Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="text-center py-8">
                          <AlertCircle className="h-8 w-8 text-destructive/60 mx-auto" />
                          <p className="mt-2 text-sm text-muted-foreground">{errorMessage}</p>
                          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3 rounded-xl text-xs">
                            Retry
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : matches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <div className="text-center py-8">
                          <LinkIcon className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                          <p className="mt-2 text-sm text-muted-foreground">No matches found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    matches.map((match, index) => (
                      <TableRow key={match.id} className="hover:bg-muted/40 transition-colors">
                        <TableCell className="text-xs text-muted-foreground">{index + 1}</TableCell>
                        <TableCell className="text-xs font-medium">{match.employeeName}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{match.employeeNo}</TableCell>
                        <TableCell className="text-xs">{match.employeePosition}</TableCell>
                        <TableCell className="text-xs font-medium">{match.openingTitle}</TableCell>
                        <TableCell className="text-xs">{match.openingDepartment}</TableCell>
                        <TableCell className="text-xs">
                          <Badge
                            variant="outline"
                            className={cn("text-[10px]", match.openingStatus === "Open" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border")}
                          >
                            {match.openingStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{format(new Date(match.matchedAt), "MMM d, yyyy")}</TableCell>
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
