"use client"

import { DataTableColumnHeader } from "@/components/global/data-table-components/data-table-column-header"
import { bookingStatusMap, classTypeMap, flightPaymentStatusMap, StatusBadge } from "@/components/global/status-badge"
import { BookingListItem } from "@/types/booking"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { BookingRowActions } from "./booking-row-actions"

export const bookingColumns: ColumnDef<BookingListItem>[] = [
  {
    accessorKey: "reference",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Reference" />,
    cell: ({ row }) => <span className="font-mono text-xs font-medium text-foreground">{row.getValue("reference")}</span>,
  },
  {
    id: "flight",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Flight" />,
    accessorFn: row => row.outboundFlight.flightNumber,
    cell: ({ row }) => {
      const booking = row.original
      return (
        <div>
          <p className="text-sm font-medium text-foreground">{booking.outboundFlight.flightNumber}</p>
          <p className="text-xs text-muted-foreground">
            {booking.outboundFlight.fromCity} → {booking.outboundFlight.toCity}
          </p>
        </div>
      )
    },
  },
  {
    id: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    accessorFn: row => row.outboundFlight.departureTime,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.original.outboundFlight.departureTime), "MMM d, yyyy")}</span>,
  },
  {
    accessorKey: "classType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Class" />,
    cell: ({ row }) => {
      return <StatusBadge meta={classTypeMap[row.original.classType]} />
    },
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
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue<string>("status")
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
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booked" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <BookingRowActions booking={row.original} />,
  },
]
