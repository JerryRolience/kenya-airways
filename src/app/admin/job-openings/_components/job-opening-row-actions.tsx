"use client"

import { AddJobOpeningForm } from "@/components/forms/job-opening-form"
import { DeleteAlertDialog } from "@/components/global/dialogs/delete-alert-dialog"
import { ToggleStatusDialog } from "@/components/global/dialogs/toggle-status"
import { JobOpeningDetailSheet } from "@/components/admin/job-openings/job-opening-detail-sheet"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeleteJobOpening } from "@/hooks/job/use-delete-job-opening"
import { useToggleJobOpeningStatus } from "@/hooks/job/use-toggle-employee-status"
import { JobOpeningListItem } from "@/types/job-opening"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

export function JobOpeningRowActions({ opening }: { opening: JobOpeningListItem }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  const { onToggleJobOpeningStatus, isPending: isTogglePending } = useToggleJobOpeningStatus({ opening, onSuccess: () => setToggleOpen(false) })
  const { onDeleteJobOpening, isPending: isDeletePending } = useDeleteJobOpening({ openingId: opening.id, onSuccess: () => setDeleteOpen(false) })

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(opening.id)}>
            Copy opening ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-xs hover:cursor-pointer"
            onClick={() => {
              setViewOpen(true)
            }}
          >
            View details
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setEditOpen(true)}>
            Edit details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-warning focus:text-warning hover:cursor-pointer" onClick={() => setToggleOpen(true)} disabled={isTogglePending}>
            {opening.isOpen ? "Close opening" : "Reopen"}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs text-destructive focus:text-destructive hover:cursor-pointer" onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddJobOpeningForm opening={opening} open={editOpen} setOpen={setEditOpen} />

      <DeleteAlertDialog entityName={opening.title} entityType="job opening" open={deleteOpen} onOpenChange={setDeleteOpen} isPending={isDeletePending} onConfirm={() => onDeleteJobOpening()} />

      <ToggleStatusDialog
        entityName={`${opening.title} (${opening.department})`}
        entityType="job opening"
        isActive={opening.isOpen}
        open={toggleOpen}
        onOpenChange={setToggleOpen}
        isPending={isTogglePending}
        onConfirm={() => onToggleJobOpeningStatus()}
      />

      {/* Job Opening Detail Sheet */}
      <JobOpeningDetailSheet
        open={viewOpen}
        onOpenChange={setViewOpen}
        opening={opening}
        onEdit={() => {
          setViewOpen(false)
          setEditOpen(true)
        }}
      />
    </>
  )
}
