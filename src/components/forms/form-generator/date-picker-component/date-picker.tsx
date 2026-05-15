"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"

interface DatePickerProps {
  placeholder?: string
  maxDate?: string
  minDate?: string
  hasError?: boolean
  field: ControllerRenderProps<FieldValues, string>
  className?: string
}

export function DatePicker({ placeholder, maxDate, minDate, hasError, field, className }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected: Date | undefined = field.value ? new Date(field.value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(hasError && "border-destructive ring-destructive", className)}>
        <Button type="button" variant="outline" className="h-10 w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          {selected ? format(selected, "PPP") : <span className="text-muted-foreground">{placeholder || "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          captionLayout="dropdown"
          onSelect={date => {
            field.onChange(date ?? null)
            setOpen(false)
          }}
          disabled={date => {
            if (maxDate && date > new Date(maxDate)) return true
            if (minDate && date < new Date(minDate)) return true
            return false
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
