import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ErrorMessage } from "@hookform/error-message"
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form"
import { Option } from "./types"
import { FieldLabel } from "./utils/field-label"
import { formatErrorMessage } from "./utils/format-error-message"

interface SelectComponentProps {
  label: string
  name: string
  placeholder?: string
  options?: Option[]
  control?: Control<FieldValues>
  errors?: FieldErrors<FieldValues>
  required?: boolean
  className?: string
}

export function SelectComponent({ label, name, placeholder = "Select an option", options = [], control, errors, required = false, className }: SelectComponentProps) {
  const hasError = !!errors?.[name]

  return (
    <div className="grid gap-2">
      <FieldLabel label={label} name={name} hasError={hasError} required={required} />

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <SelectTrigger className={cn("h-10 w-full", hasError && "border-destructive ring-destructive", className)}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent position="popper" className="max-h-75 min-w-(--radix-select-trigger-width) overflow-y-auto" sideOffset={5}>
              {options?.map(option => (
                <SelectItem key={option.value} value={String(option.value)} className="cursor-pointer min-w-50 w-full">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {errors && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => <p className="text-destructive text-sm mt-1">{formatErrorMessage(message, name.charAt(0).toUpperCase() + name.slice(1))}</p>}
        />
      )}
    </div>
  )
}
