"use client"

import { phoneUtils } from "@/components/forms/form-generator/utils/phone"
import { DataTableColumnHeader } from "@/components/global/data-table-components/data-table-column-header"
import { StatusBadge, activeStatusMap } from "@/components/global/status-badge"
import { TableUserAvatar } from "@/components/global/user-avatar/table-user-avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { EmployeeListItem } from "@/types/employee"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { EmployeeRowActions } from "./employee-row-action"
import { ActiveStatus } from "../../../../../generated/prisma/enums"

export const employeeColumns: ColumnDef<EmployeeListItem>[] = [
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
    enableSorting: true,
    enableHiding: true,
    enableGrouping: true,
  },
  {
    accessorKey: "employeeNo",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee Code" />,
    cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.getValue("employeeNo")}</span>,
  },
  {
    id: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const employee = row.original

      return <TableUserAvatar firstName={employee.firstName} lastName={employee.lastName} email={employee.email} href={`/employees/${employee.id}`} />
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm tabular-nums whitespace-nowrap">{phoneUtils.formatInternational(row.getValue("phone"))}</span>,
  },
  {
    accessorKey: "position",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    cell: ({ row }) => {
      const position = row.getValue<string | null>("position")
      return position ? <span className="text-sm">{position}</span> : <span className="text-sm text-muted-foreground">—</span>
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
    cell: ({ row }) => {
      const department = row.getValue<string | null>("department")
      return department ? <span className="text-sm">{department}</span> : <span className="text-sm text-muted-foreground">—</span>
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>("isActive")
      return <StatusBadge meta={activeStatusMap[isActive ? ActiveStatus.ACTIVE : ActiveStatus.INACTIVE]} />
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Registered" />,
    cell: ({ row }) => <span className="text-sm text-muted-foreground whitespace-nowrap">{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <EmployeeRowActions employee={row.original} />,
  },
]
