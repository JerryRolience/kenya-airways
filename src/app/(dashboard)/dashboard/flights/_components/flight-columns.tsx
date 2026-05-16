"use client"

import { DataTableColumnHeader } from "@/components/global/data-table-components/data-table-column-header"
import { bookingStatusMap, classTypeMap, flightPaymentStatusMap, StatusBadge } from "@/components/global/status-badge"
import { UserFlight } from "@/types/flights"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const flightColumns: ColumnDef<UserFlight>[] = [
  {
    accessorKey: "flightNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Flight" />,
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium text-foreground">{row.getValue("flightNumber")}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.fromCity} → {row.original.toCity}
        </p>
      </div>
    ),
  },
  {
    id: "route",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Route" />,
    accessorFn: row => `${row.from} → ${row.to}`,
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium text-foreground">
          {row.original.from} → {row.original.to}
        </p>
        <p className="text-xs text-muted-foreground">
          {row.original.fromCity} → {row.original.toCity}
        </p>
      </div>
    ),
  },
  {
    id: "departureTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Departure" />,
    accessorFn: row => row.departureTime,
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium text-foreground">{format(new Date(row.original.departureTime), "MMM d, yyyy")}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(row.original.departureTime), "HH:mm")} - {format(new Date(row.original.arrivalTime), "HH:mm")}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "classType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
    cell: ({ row }) => {
      return <StatusBadge meta={classTypeMap[row.original.classType]} />
    },
  },
  {
    accessorKey: "bookingReference",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Ref" />,
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("bookingReference")}</span>,
  },
  {
    accessorKey: "passengerCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pax" />,
    cell: ({ row }) => <span className="text-sm tabular-nums">{row.getValue<number>("passengerCount")}</span>,
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <span className="text-sm font-medium tabular-nums">KES {row.getValue<number>("totalAmount").toLocaleString()}</span>,
  },
  {
    accessorKey: "bookingStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<string>("bookingStatus")
      return <StatusBadge meta={bookingStatusMap[status]} />
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Payment" />,
    cell: ({ row }) => {
      const status = row.getValue<string>("paymentStatus")
      return <StatusBadge meta={flightPaymentStatusMap[status]} />
    },
  },
  {
    accessorKey: "isReturnTrip",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Trip" />,
    cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.getValue<boolean>("isReturnTrip") ? "Return" : "One-way"}</span>,
  },
]
