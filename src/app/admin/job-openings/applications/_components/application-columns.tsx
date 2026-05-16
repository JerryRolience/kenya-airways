"use client"

import { DataTableColumnHeader } from "@/components/global/data-table-components/data-table-column-header"
import { jobApplicationStatusMap, StatusBadge } from "@/components/global/status-badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ApplicationListItem } from "@/types/job-application"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { ApplicationRowActions } from "./application-row-actions"

export const applicationColumns: ColumnDef<ApplicationListItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={v => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={v => row.toggleSelected(!!v)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "applicantName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applicant" />,
    accessorFn: row => row.applicantName,
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-foreground">{row.original.applicantName}</p>
        <p className="text-xs text-muted-foreground">{row.original.applicantEmail}</p>
      </div>
    ),
  },
  {
    id: "openingTitle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
    accessorFn: row => row.openingTitle,
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-foreground">{row.original.openingTitle}</p>
        <p className="text-xs text-muted-foreground">{row.original.openingDepartment}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<string>("status")
      return <StatusBadge meta={jobApplicationStatusMap[status]} />
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applied" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ApplicationRowActions application={row.original} />,
  },
]
