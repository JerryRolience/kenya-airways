import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"

interface DataTableCursorPaginationProps {
  currentPage: number
  totalPages: number
  total: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  isFetching: boolean
  selectedCount: number
  pageSize: number
  setPageSize: (size: number) => void
  onNextPage: () => void
  onPreviousPage: () => void
  onFirstPage: () => void
}

export function DataTableCursorPagination({
  currentPage,
  totalPages,
  total,
  pageSize,
  setPageSize,
  hasNextPage,
  hasPreviousPage,
  isFetching,
  selectedCount,
  onNextPage,
  onPreviousPage,
  onFirstPage,
}: DataTableCursorPaginationProps) {
  // Calculate display range
  const start = currentPage * pageSize + 1
  const end = Math.min((currentPage + 1) * pageSize, total)

  return (
    <div className="flex items-center justify-between px-1 py-1">
      {/* Left — selection / range info */}
      <div className="flex items-center gap-3">
        {selectedCount > 0 ? (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{selectedCount}</span> row{selectedCount === 1 ? "" : "s"} selected
          </p>
        ) : total > 0 ? (
          <p className="text-xs text-muted-foreground">
            {isFetching ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading...
              </span>
            ) : (
              <>
                <span className="font-medium text-foreground tabular-nums">
                  {start}–{end}
                </span>{" "}
                of <span className="font-medium text-foreground tabular-nums">{total}</span> patient{total === 1 ? "" : "s"}
              </>
            )}
          </p>
        ) : null}
      </div>

      {/* Right — page controls */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {totalPages > 0 && (
          <p className="text-xs text-muted-foreground tabular-nums hidden sm:block">
            Page <span className="font-medium text-foreground">{currentPage + 1}</span>{" "}
            {totalPages > 1 && (
              <>
                of <span className="font-medium text-foreground">{totalPages}</span>
              </>
            )}
          </p>
        )}

        <div className="flex items-center space-x-2">
          <p className="text-xs font-medium text-muted-foreground hover:cursor-pointer">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={value => {
              setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 30, 40, 50].map(pageSize => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:cursor-pointer"
            onClick={onFirstPage}
            disabled={!hasPreviousPage || isFetching}
            title="First page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
            <span className="sr-only">First page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:cursor-pointer"
            onClick={onPreviousPage}
            disabled={!hasPreviousPage || isFetching}
            title="Previous page"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 hover:cursor-pointer"
            onClick={onNextPage}
            disabled={!hasNextPage || isFetching}
            title="Next page"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
