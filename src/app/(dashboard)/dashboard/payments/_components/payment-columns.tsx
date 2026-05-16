"use client"

import { DataTableColumnHeader } from "@/components/global/data-table-components/data-table-column-header"
import { bookingStatusMap, paymentMethodMap, StatusBadge } from "@/components/global/status-badge"
import { UserPayment } from "@/types/payment"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export const paymentColumns: ColumnDef<UserPayment>[] = [
  {
    accessorKey: "bookingReference",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Ref" />,
    cell: ({ row }) => <span className="font-mono text-xs font-medium text-foreground">{row.getValue("bookingReference")}</span>,
  },
  {
    id: "flight",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Flight" />,
    accessorFn: row => row.flightNumber,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <div>
          <p className="text-sm font-medium text-foreground">{payment.flightNumber}</p>
          <p className="text-xs text-muted-foreground">
            {payment.from} → {payment.to}
          </p>
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
    cell: ({ row }) => <span className="text-sm font-semibold text-foreground tabular-nums">KES {row.getValue<number>("amount").toLocaleString()}</span>,
  },
  {
    accessorKey: "method",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Method" />,
    cell: ({ row }) => {
      const method = row.getValue<string>("method")
      return <StatusBadge meta={paymentMethodMap[method]} />
    },
  },
  {
    accessorKey: "transactionRef",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Transaction Ref" />,
    cell: ({ row }) => {
      const ref = row.getValue<string | null>("transactionRef")
      return <span className="font-mono text-xs text-muted-foreground">{ref || "—"}</span>
    },
  },
  {
    accessorKey: "paidAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.getValue("paidAt")), "MMM d, yyyy · h:mm a")}</span>,
  },
  {
    accessorKey: "bookingStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Booking Status" />,
    cell: ({ row }) => {
      const status = row.getValue<string>("bookingStatus")

      return <StatusBadge meta={bookingStatusMap[status]} />
    },
  },
  {
    accessorKey: "departureTime",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Flight Date" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.getValue("departureTime")), "MMM d, yyyy")}</span>,
  },
]
