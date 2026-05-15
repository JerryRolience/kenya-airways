"use client"

import { DataTableColumnHeader } from "@/components/global/data-table-components/data-table-column-header"
import { jobOpeningStatusMap, StatusBadge } from "@/components/global/status-badge"
import { Checkbox } from "@/components/ui/checkbox"
import { JobOpeningListItem } from "@/types/job-opening"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { JobOpeningRowActions } from "./job-opening-row-actions"

export const jobOpeningColumns: ColumnDef<JobOpeningListItem>[] = [
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
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Position" />,
    cell: ({ row }) => <span className="font-medium text-foreground text-sm">{row.getValue("title")}</span>,
  },
  {
    accessorKey: "department",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.getValue("department")}</span>,
  },
  {
    accessorKey: "isOpen",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isOpen = row.getValue<boolean>("isOpen")

      return <StatusBadge meta={jobOpeningStatusMap[isOpen ? "OPEN" : "CLOSED"]} />
    },
  },
  {
    accessorKey: "applicationsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Applications" />,
    cell: ({ row }) => {
      const count = row.getValue<number>("applicationsCount")
      return <span className="text-sm tabular-nums">{count}</span>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Posted" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</span>,
  },
  {
    accessorKey: "closedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Closed" />,
    cell: ({ row }) => {
      const closedAt = row.getValue<Date | null>("closedAt")
      return <span className="text-sm text-muted-foreground whitespace-nowrap">{closedAt ? format(new Date(closedAt), "MMM d, yyyy") : "—"}</span>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <JobOpeningRowActions opening={row.original} />,
  },
]
