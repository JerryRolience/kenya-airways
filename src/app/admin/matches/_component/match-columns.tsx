"use client"

import { DataTableColumnHeader } from "@/components/global/data-table-components/data-table-column-header"
import { jobOpeningStatusMap, StatusBadge } from "@/components/global/status-badge"
import { Checkbox } from "@/components/ui/checkbox"
import { MatchListItem } from "@/types/match"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MatchRowActions } from "./match-row-actions"

export const matchColumns: ColumnDef<MatchListItem>[] = [
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
    id: "employeeName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
    accessorFn: row => row.employeeName,
    cell: ({ row }) => {
      const match = row.original
      return (
        <div>
          <p className="text-sm font-medium text-foreground">{match.employeeName}</p>
          <p className="text-xs text-muted-foreground">{match.employee.employeeNo}</p>
        </div>
      )
    },
  },
  {
    id: "employeePosition",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee Position" />,
    accessorFn: row => row.employee.position,
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.employee.position}</span>,
  },
  {
    id: "openingTitle",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Opening" />,
    accessorFn: row => row.openingTitle,
    cell: ({ row }) => {
      const match = row.original
      return (
        <div>
          <p className="text-sm font-medium text-foreground">{match.openingTitle}</p>
          <p className="text-xs text-muted-foreground">{match.opening.department}</p>
        </div>
      )
    },
  },
  {
    id: "openingStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Opening Status" />,
    accessorFn: row => row.opening.isOpen,
    cell: ({ row }) => {
      const isOpen = row.original.opening.isOpen
      return <StatusBadge meta={jobOpeningStatusMap[isOpen ? "OPEN" : "CLOSED"]} />
    },
  },
  {
    accessorKey: "matchedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Matched" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.getValue("matchedAt")), "MMM d, yyyy")}</span>,
  },
  {
    accessorKey: "notes",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Notes" />,
    cell: ({ row }) => {
      const notes = row.getValue<string | null>("notes")
      return <span className="text-sm text-muted-foreground truncate max-w-37.5 block">{notes || "—"}</span>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <MatchRowActions match={row.original} />,
  },
]
