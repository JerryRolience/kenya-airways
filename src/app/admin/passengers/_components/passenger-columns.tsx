"use client"

import { DataTableColumnHeader } from "@/components/global/data-table-components/data-table-column-header"
import { passengerTypeMap, StatusBadge } from "@/components/global/status-badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PassengerListItem } from "@/types/passenger"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { PassengerRowActions } from "./passenger-row-action"

export const passengerColumns: ColumnDef<PassengerListItem>[] = [
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
    id: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Passenger" />,
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const passenger = row.original
      return (
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-medium text-foreground">
              {passenger.title && `${passenger.title} `}
              {passenger.firstName} {passenger.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{passenger.email}</p>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "passportNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Passport" />,
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("passportNumber") || "—"}</span>,
  },
  {
    accessorKey: "nationality",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nationality" />,
    cell: ({ row }) => <span className="text-sm">{row.getValue("nationality") || "—"}</span>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => <span className="text-sm tabular-nums whitespace-nowrap">{row.getValue("phone") || "—"}</span>,
  },
  {
    id: "accountType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Account" />,
    accessorFn: row => (row.userId ? "Registered" : "Guest"),
    cell: ({ row }) => {
      const hasAccount = !!row.original.userId
      return <StatusBadge meta={passengerTypeMap[hasAccount ? "REGISTERED" : "GUESTS"]} />
    },
  },
  {
    accessorKey: "bookingsCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bookings" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.getValue<number>("bookingsCount")}</span>,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Registered" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <PassengerRowActions passenger={row.original} />,
  },
]
