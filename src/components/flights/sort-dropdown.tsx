"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"

interface SortDropdownProps {
  sortBy: "price" | "duration" | "departureTime"
  sortOrder: "asc" | "desc"
  onSortByChange: (v: "price" | "duration" | "departureTime") => void
  onSortOrderChange: (v: "asc" | "desc") => void
}

export function SortDropdown({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      <Select
        value={`${sortBy}-${sortOrder}`}
        onValueChange={value => {
          const [by, order] = value.split("-") as [typeof sortBy, typeof sortOrder]
          onSortByChange(by)
          onSortOrderChange(order)
        }}
      >
        <SelectTrigger className="h-9 w-44 rounded-xl text-xs bg-background border-border/60">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="departureTime-asc">Earliest departure</SelectItem>
          <SelectItem value="departureTime-desc">Latest departure</SelectItem>
          <SelectItem value="price-asc">Lowest price</SelectItem>
          <SelectItem value="price-desc">Highest price</SelectItem>
          <SelectItem value="duration-asc">Shortest duration</SelectItem>
          <SelectItem value="duration-desc">Longest duration</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
