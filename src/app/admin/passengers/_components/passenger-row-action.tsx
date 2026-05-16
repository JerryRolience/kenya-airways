"use client"

import { DeleteAlertDialog } from "@/components/global/dialogs/deleteAlertDialog"
import { PassengerDetailSheet } from "@/components/admin/passenger-details-sheet"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeletePassenger } from "@/hooks/passenger/use-delete-passenger"
import { PassengerListItem } from "@/types/passenger"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

export function PassengerRowActions({ passenger }: { passenger: PassengerListItem }) {
  const [viewOpen, setViewOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { onDeletePassenger, isPending: isDeletePending } = useDeletePassenger({ passengerId: passenger.id })

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
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setViewOpen(true)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(passenger.email)}>
            Copy email
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(passenger.passportNumber || "")}>
            Copy passport
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-destructive focus:text-destructive hover:cursor-pointer" onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Passenger Detail Sheet */}
      <PassengerDetailSheet open={viewOpen} onOpenChange={setViewOpen} passenger={passenger} />

      {/* Delete Dialog */}
      <DeleteAlertDialog
        entityName={`${passenger.firstName} ${passenger.lastName}`}
        entityType="passenger"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        isPending={isDeletePending}
        onConfirm={() => onDeletePassenger()}
      />
    </>
  )
}
