"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ApplicationListItem } from "@/types/job-application"
import { format } from "date-fns"
import { Building2, Calendar, Clock, ExternalLink, FileText, Link as LinkIcon, Mail, Phone, User } from "lucide-react"

interface ApplicationDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: ApplicationListItem | null
}

const STATUS_MAP: Record<string, { label: string; variant: string; color: string }> = {
  PENDING: {
    label: "Pending",
    variant: "warning",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  REVIEWED: {
    label: "Reviewed",
    variant: "info",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    variant: "success",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  ACCEPTED: {
    label: "Hired",
    variant: "success",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    variant: "muted",
    color: "bg-muted text-muted-foreground border-border",
  },
}

export function ApplicationDetailSheet({ open, onOpenChange, application }: ApplicationDetailSheetProps) {
  if (!application) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg lg:max-w-xl overflow-y-auto p-0">
          <div className="p-6 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">Application not found</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  const statusMeta = STATUS_MAP[application.status] || STATUS_MAP.PENDING

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full md:max-w-lg lg:max-w-xl overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-linear-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground p-6">
          <SheetHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs">Application</Badge>
              <Badge className={cn("text-xs border", statusMeta.color)}>{statusMeta.label}</Badge>
            </div>
            <SheetTitle className="text-white font-display text-xl">{application.applicantName}</SheetTitle>
            <p className="text-sm text-white/70 mt-1">
              Applied for <span className="font-medium text-white">{application.openingTitle}</span>
            </p>
          </SheetHeader>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-accent mb-1" />
              <p className="text-xs font-bold font-display">{format(new Date(application.createdAt), "MMM d, yyyy")}</p>
              <p className="text-[10px] text-white/60">Applied</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-accent mb-1" />
              <p className="text-xs font-bold font-display">{format(new Date(application.updatedAt), "MMM d, yyyy")}</p>
              <p className="text-[10px] text-white/60">Last Updated</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Applicant Information */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-accent" />
              Applicant Information
            </h4>
            <div className="mt-3 space-y-3">
              <DetailItem icon={User} label="Name" value={application.applicantName} />
              <DetailItem icon={Mail} label="Email" value={application.applicantEmail} />
              <DetailItem icon={Phone} label="Phone" value={application.applicantPhone || "Not provided"} />
            </div>
          </div>

          <Separator />

          {/* Position Details */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4 text-accent" />
              Position
            </h4>
            <div className="mt-3 space-y-3">
              <DetailItem icon={Building2} label="Opening" value={application.openingTitle} />
              <DetailItem icon={Building2} label="Department" value={application.openingDepartment} />
              <Badge
                variant="outline"
                className={cn("text-[10px] mt-2", application.openingIsOpen ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-muted text-muted-foreground border-border")}
              >
                {application.openingIsOpen ? "Opening Active" : "Opening Closed"}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Cover Letter */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              Cover Letter
            </h4>
            <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{application.coverLetter}</p>
            </div>
          </div>

          {/* CV Link */}
          {application.cvUrl && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-accent" />
                  CV / Resume
                </h4>
                <a href={application.cvUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-accent hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  View CV / Resume
                </a>
              </div>
            </>
          )}

          <Separator />

          {/* Status Info */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Status
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <DetailItem icon={Calendar} label="Applied" value={format(new Date(application.createdAt), "MMM d, yyyy 'at' h:mm a")} />
              <DetailItem icon={Clock} label="Last Updated" value={format(new Date(application.updatedAt), "MMM d, yyyy 'at' h:mm a")} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground wrap-break-word">{value}</p>
      </div>
    </div>
  )
}
