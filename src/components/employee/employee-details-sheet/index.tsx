"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Building2, Calendar, FileText, Link, Trash2, User, UserCircle } from "lucide-react"

interface MatchDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  matchId: string | null
  onRemove?: (id: string) => void
}

export function MatchDetailSheet({ open, onOpenChange, matchId, onRemove }: MatchDetailSheetProps) {
  const isLoading = false
  const match = null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg lg:max-w-xl overflow-y-auto p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : match ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground p-6">
              <SheetHeader>
                <div className="flex items-center gap-2 mb-3">
                  <Link className="h-5 w-5 text-accent" />
                  <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs">Employee Match</Badge>
                </div>
                <SheetTitle className="text-white font-display text-xl">Match Details</SheetTitle>
              </SheetHeader>

              {/* Matched date */}
              <div className="flex items-center gap-2 mt-4 text-sm text-white/70">
                <Calendar className="h-4 w-4" />
                Matched on {format(new Date(match.matchedAt), "MMMM d, yyyy 'at' h:mm a")}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Employee Details */}
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-accent" />
                  Employee
                </h4>
                <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{match.employeeName}</p>
                      <p className="text-xs text-muted-foreground">{match.employee.employeeNo}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <DetailItem icon={Building2} label="Department" value={match.employee.department} />
                    <DetailItem icon={UserCircle} label="Position" value={match.employee.position} />
                  </div>
                  <Badge className={cn("mt-3 text-xs", match.employee.isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border")}>
                    {match.employee.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Opening Details */}
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-accent" />
                  Job Opening
                </h4>
                <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-4">
                  <p className="font-semibold text-foreground">{match.openingTitle}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{match.opening.department}</p>
                  <Badge className={cn("mt-3 text-xs", match.opening.isOpen ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border")}>
                    {match.opening.isOpen ? "Open" : "Closed"}
                  </Badge>
                </div>
              </div>

              {/* Notes */}
              {match.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      Notes
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed bg-muted/30 rounded-xl p-4 border border-border/60">{match.notes}</p>
                  </div>
                </>
              )}

              <Separator />

              {/* Actions */}
              {onRemove && (
                <Button onClick={() => onRemove(match.id)} variant="destructive" className="w-full rounded-xl">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove Match
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <Link className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">Match not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
