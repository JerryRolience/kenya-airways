"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useState } from "react"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { Option } from "../types"

interface MultiSelectProps {
  label: string
  placeholder?: string
  multiselectPlaceholder?: string
  options?: Option[]
  hasError?: boolean
  field: ControllerRenderProps<FieldValues, string>
}

export function MultiSelect({ label, placeholder, multiselectPlaceholder, options = [], hasError, field }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedValues: string[] = field.value || []

  const handleSelect = (value: string | number) => {
    const stringValue = String(value)
    const newValues = selectedValues.includes(stringValue) ? selectedValues.filter((v: string) => v !== stringValue) : [...selectedValues, stringValue]
    field.onChange(newValues)
  }

  const handleRemove = (value: string | number) => {
    const stringValue = String(value)
    const newValues = selectedValues.filter((v: string) => v !== stringValue)
    field.onChange(newValues)
  }

  const selectedOptions = options.filter(option => selectedValues.includes(String(option.value)))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn("h-10 w-full", hasError && "border-destructive ring-destructive")} asChild>
        <Button type="button" variant="outline" className="h-auto min-h-10 w-full justify-start">
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map(option => (
                <Badge key={option.value} variant="secondary" className="mr-1">
                  {option.label}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={e => {
                      e.stopPropagation()
                      handleRemove(option.value)
                    }}
                  />
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{multiselectPlaceholder || placeholder || "Select options..."}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase() || "options"}...`} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem key={option.value} value={String(option.value)} onSelect={() => handleSelect(option.value)}>
                  <Checkbox checked={selectedValues.includes(String(option.value))} className="mr-2" />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
