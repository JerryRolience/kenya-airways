"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeleteAlertDialog } from "@/components/global/dialogs/deleteAlertDialog"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { ApplicationStatus } from "../../../../../../generated/prisma/enums"
import { ApplicationListItem } from "@/types/job-application"
import { useUpdateJobApplicationStatus } from "@/hooks/job/use-update-job-application-status"
import { useHireApplicant } from "@/hooks/job/use-hire-applicant"
import { ApplicationDetailSheet } from "@/components/admin/job-openings/application-details-sheet"

export function ApplicationRowActions({ application }: { application: ApplicationListItem }) {
  const [viewOpen, setViewOpen] = useState(false)

  // Confirmation dialog states
  const [reviewOpen, setReviewOpen] = useState(false)
  const [shortlistOpen, setShortlistOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [hireOpen, setHireOpen] = useState(false)

  const { onUpdateJobApplicationStatus, isPending: isUpdating } = useUpdateJobApplicationStatus()
  const { mutate: hireApplicant, isPending: isHiring } = useHireApplicant()

  const isHired = application.status === ApplicationStatus.ACCEPTED

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setViewOpen(true)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!isHired && (
            <>
              <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setReviewOpen(true)}>
                Mark as reviewed
              </DropdownMenuItem>
              <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setShortlistOpen(true)}>
                Shortlist
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-destructive focus:text-destructive hover:cursor-pointer" onClick={() => setRejectOpen(true)}>
                Reject
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-emerald-600 focus:text-emerald-600 hover:cursor-pointer font-semibold" onClick={() => setHireOpen(true)} disabled={isHiring}>
                {isHiring ? "Hiring..." : "✅ Accept & Hire"}
              </DropdownMenuItem>
            </>
          )}
          {isHired && (
            <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
              Already hired
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Sheet */}
      <ApplicationDetailSheet open={viewOpen} onOpenChange={setViewOpen} application={application} />

      {/* Mark as Reviewed Confirmation */}
      <DeleteAlertDialog
        entityName={`application from ${application.applicantName}`}
        entityType="application"
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        isPending={isUpdating}
        onConfirm={() =>
          onUpdateJobApplicationStatus(
            {
              applicationId: application.id,
              status: ApplicationStatus.REVIEWED,
            },
            { onSuccess: () => setReviewOpen(false) },
          )
        }
        title="Mark as Reviewed"
        description={`Are you sure you want to mark ${application.applicantName}'s application for "${application.openingTitle}" as reviewed?`}
        confirmLabel="Mark Reviewed"
        variant="default"
      />

      {/* Shortlist Confirmation */}
      <DeleteAlertDialog
        entityName={`application from ${application.applicantName}`}
        entityType="application"
        open={shortlistOpen}
        onOpenChange={setShortlistOpen}
        isPending={isUpdating}
        onConfirm={() =>
          onUpdateJobApplicationStatus(
            {
              applicationId: application.id,
              status: ApplicationStatus.SHORTLISTED,
            },
            { onSuccess: () => setShortlistOpen(false) },
          )
        }
        title="Shortlist Applicant"
        description={`Are you sure you want to shortlist ${application.applicantName} for "${application.openingTitle}"?`}
        confirmLabel="Shortlist"
        variant="warning"
      />

      {/* Reject Confirmation */}
      <DeleteAlertDialog
        entityName={`application from ${application.applicantName}`}
        entityType="application"
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        isPending={isUpdating}
        onConfirm={() =>
          onUpdateJobApplicationStatus(
            {
              applicationId: application.id,
              status: ApplicationStatus.REJECTED,
            },
            { onSuccess: () => setRejectOpen(false) },
          )
        }
        title="Reject Application"
        description={`Are you sure you want to reject ${application.applicantName}'s application for "${application.openingTitle}"? This action cannot be undone.`}
        confirmLabel="Reject"
        variant="destructive"
      />

      {/* Hire Confirmation */}
      <DeleteAlertDialog
        entityName={`application from ${application.applicantName}`}
        entityType="application"
        open={hireOpen}
        onOpenChange={setHireOpen}
        isPending={isHiring}
        onConfirm={() =>
          hireApplicant(application.id, {
            onSuccess: () => setHireOpen(false),
          })
        }
        title="Accept & Hire Applicant"
        description={`This will create an employee profile for ${application.applicantName} as "${application.openingTitle}" in ${application.openingDepartment}, upgrade their role to EMPLOYEE, and match them to this opening. Are you sure?`}
        confirmLabel="Accept & Hire"
        variant="success"
      />
    </>
  )
}
