"use client"

import { DetailItem } from "@/components/global/sheets/detail-item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { JobOpeningListItem } from "@/types/job-opening"
import { format } from "date-fns"
import { Building2, Calendar, Clock, Edit, FileText, Link, MapPin, Timer, Users, X } from "lucide-react"

interface JobOpeningDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  opening: JobOpeningListItem
  onEdit?: (id: string) => void
}

export function JobOpeningDetailSheet({ open, onOpenChange, opening, onEdit }: JobOpeningDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg lg:max-w-xl overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-linear-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground p-6">
          <div className="flex items-start justify-between">
            <SheetHeader className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs">{opening.department}</Badge>
                <Badge
                  className={cn(
                    "text-xs border",
                    opening.isOpen ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" : "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30",
                  )}
                >
                  {opening.isOpen ? "Open" : "Closed"}
                </Badge>
              </div>
              <SheetTitle className="text-white font-display text-xl">{opening.title}</SheetTitle>
            </SheetHeader>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Users className="h-4 w-4 text-accent mb-1" />
              <p className="text-lg font-bold font-display">{opening.applicationsCount}</p>
              <p className="text-[10px] text-white/60">Applicants</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Link className="h-4 w-4 text-accent mb-1" />
              <p className="text-lg font-bold font-display">{opening.assignmentsCount || 0}</p>
              <p className="text-[10px] text-white/60">Matched</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-accent mb-1" />
              <p className="text-lg font-bold font-display">{format(new Date(opening.createdAt), "MMM d")}</p>
              <p className="text-[10px] text-white/60">Posted</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              Description
            </h4>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{opening.description}</p>
          </div>

          <Separator />

          {/* Details */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              Position Details
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <DetailItem icon={Building2} label="Department" value={opening.department} />
              <DetailItem icon={MapPin} label="Location" value="Nairobi, Kenya" />
              <DetailItem icon={Calendar} label="Posted" value={format(new Date(opening.createdAt), "MMM d, yyyy")} />
              <DetailItem icon={Timer} label="Updated" value={format(new Date(opening.updatedAt), "MMM d, yyyy")} />
              {opening.closedAt && <DetailItem icon={X} label="Closed" value={format(new Date(opening.closedAt), "MMM d, yyyy")} />}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            {onEdit && (
              <Button onClick={() => onEdit(opening.id)} className="flex-1 rounded-xl">
                <Edit className="mr-2 h-4 w-4" />
                Edit Opening
              </Button>
            )}
            <Button variant="outline" className="rounded-xl">
              {opening.isOpen ? "Close Opening" : "Reopen"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
