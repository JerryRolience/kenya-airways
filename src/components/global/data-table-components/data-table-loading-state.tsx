"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { TableBody, TableCell, TableRow } from "@/components/ui/table"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

const WIDTH_PATTERN = [72, 85, 60, 90, 65, 78, 55, 88, 70, 82]

interface DataTableLoadingStateProps<TData> {
  columns: ColumnDef<TData, any>[]
  rows?: number
}

export function DataTableLoadingState<TData>({ columns, rows = 8 }: DataTableLoadingStateProps<TData>) {
  const widths = useMemo(
    () =>
      Array.from({ length: rows }, (_, i) =>
        Array.from({ length: columns.length }, (_, j) => WIDTH_PATTERN[(i * columns.length + j) % WIDTH_PATTERN.length]),
      ),
    [rows, columns.length],
  )

  return (
    <TableBody>
      <style>{`
        @keyframes tbl-fade-in {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {widths.map((rowWidths, i) => (
        <TableRow
          key={i}
          style={{
            animation: `tbl-fade-in 0.2s ${i * 0.015}s ease-out both`,
          }}
        >
          {rowWidths.map((width, j) => (
            <TableCell key={j}>
              <Skeleton
                className="h-4 rounded-md"
                style={{
                  width: `${width}%`,
                  opacity: Math.max(1 - i * 0.07, 0.4),
                }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
