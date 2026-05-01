import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@hookform/error-message"
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form"
import { formatErrorMessage } from "./utils/format-error-message"
import { cn } from "@/lib/utils"

interface InputNumberComponentProps {
  label?: string
  name: string
  placeholder?: string
  required?: boolean
  minNumber?: number
  maxNumber?: number
  control?: Control<FieldValues>
  errors?: FieldErrors<FieldValues>
  helperText?: string
}

export function InputNumberComponent({
  label,
  name,
  placeholder,
  required,
  minNumber,
  maxNumber,
  control,
  errors,
  helperText,
}: InputNumberComponentProps) {
  const hasError = !!errors?.[name]

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={`input-${name}`} className={hasError ? "text-destructive" : ""}>
          {label}
          {required && <span className="ml-1">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative ">
            <Input
              id={`input-${name}`}
              type="number"
              placeholder={placeholder}
              className={cn(
                "h-10 rounded-lg bg-background",
                "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                hasError && "border-destructive",
              )}
              value={field.value ?? ""}
              onChange={e => {
                const value = e.target.value
                // Convert to number or undefined
                let numValue = value === "" ? undefined : Number(value)

                // Apply min/max constraints
                if (numValue !== undefined) {
                  if (minNumber !== undefined && numValue < minNumber) numValue = minNumber
                  if (maxNumber !== undefined && numValue > maxNumber) numValue = maxNumber
                }

                field.onChange(numValue)
              }}
              onKeyDown={e => {
                // Prevent arrow keys from changing value
                if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                  e.preventDefault()
                }
              }}
              onWheel={e => {
                // Prevent mouse wheel from changing value
                e.preventDefault()
                e.currentTarget.blur() // Remove focus to prevent accidental changes
              }}
            />

            {helperText && <p className="text-sm text-muted-foreground mt-1">{helperText}</p>}
          </div>
        )}
      />

      {errors && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="text-destructive text-sm mt-1">
              {formatErrorMessage(message, label ?? name.charAt(0).toUpperCase() + name.slice(1))}
            </p>
          )}
        />
      )}
    </div>
  )
}
