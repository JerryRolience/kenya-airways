"use client"

import { EmployeeDetailSheet } from "@/components/admin/employee/employee-details-sheet"
import { AddEmployeeForm } from "@/components/forms/employee-form"
import { DeleteAlertDialog } from "@/components/global/dialogs/delete-alert-dialog"
import { ToggleStatusDialog } from "@/components/global/dialogs/toggle-status"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDeleteEmployee } from "@/hooks/employee/use-delete-employee"
import { useToggleEmployeeStatus } from "@/hooks/employee/use-toggle-employee-status"
import { EmployeeListItem } from "@/types/employee"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"

export function EmployeeRowActions({ employee }: { employee: EmployeeListItem }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [toggleOpen, setToggleOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  const { onToggleEmployeeStatus, isPending: isTogglePending } = useToggleEmployeeStatus({ employee, onSuccess: () => setToggleOpen(false) })
  const { onDeleteEmployee, isPending: isDeletePending } = useDeleteEmployee({ employeeId: employee.id, onSuccess: () => setDeleteOpen(false) })

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
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => navigator.clipboard.writeText(employee.employeeNo)}>
            Copy employee code
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setViewOpen(true)}>
            View profile
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setEditOpen(true)}>
            Edit details
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs text-warning focus:text-warning hover:cursor-pointer" onClick={() => setToggleOpen(true)}>
            {employee.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs text-destructive focus:text-destructive hover:cursor-pointer" onClick={() => setDeleteOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddEmployeeForm employee={employee} open={editOpen} setOpen={setEditOpen} />

      <DeleteAlertDialog
        entityName={`${employee.firstName} ${employee.lastName}`}
        entityType="employee"
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        isPending={isDeletePending}
        onConfirm={() => onDeleteEmployee()}
      />

      <ToggleStatusDialog
        entityName={`${employee.firstName} ${employee.lastName}`}
        entityType="employee"
        isActive={employee.isActive}
        open={toggleOpen}
        onOpenChange={setToggleOpen}
        isPending={isTogglePending}
        onConfirm={() => onToggleEmployeeStatus()}
      />

      {/* Employee Detail Sheet */}
      <EmployeeDetailSheet
        open={viewOpen}
        onOpenChange={setViewOpen}
        employee={employee}
        onEdit={() => {
          setViewOpen(false)
          setEditOpen(true)
        }}
      />
    </>
  )
}
