// components/global/date-picker.tsx
"use client"

import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DatePickerInputProps {
  defaultDate?: Date
  onChange?: (date: Date) => void
  className?: string
  minDate?: Date
}

export function DatePickerInput({ defaultDate, onChange, className, minDate }: DatePickerInputProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(defaultDate)

  const handleSelect = (selected: Date | undefined) => {
    if (!selected) return
    setDate(selected)
    setOpen(false)
    onChange?.(selected)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 w-full justify-start rounded-xl border border-input bg-background px-3 text-left text-sm font-normal",
            "hover:bg-muted/50 hover:border-border transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:ring-offset-0",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleSelect} disabled={d => (minDate ? d < minDate : d < new Date("1900-01-01"))} initialFocus className="rounded-xl" />
      </PopoverContent>
    </Popover>
  )
}
