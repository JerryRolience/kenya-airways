"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ErrorMessage } from "@hookform/error-message"
import { Control, FieldErrors, FieldValues } from "react-hook-form"
import PhoneInputWithCountry, { Country } from "react-phone-number-input/react-hook-form"
import PhoneInputBasic from "react-phone-number-input/react-hook-form-input"
import "react-phone-number-input/style.css"
import { formatErrorMessage } from "./utils/format-error-message"

interface PhoneInputComponentProps {
  label?: string
  name: string
  placeholder?: string
  value?: string
  control?: Control<FieldValues>
  errors?: FieldErrors<FieldValues>
  withCountrySelect?: boolean
  required?: boolean
  international?: boolean
  defaultCountry?: Country
  className?: string
}

// Style overrides for phone input
const phoneInputStyles = {
  container: "relative",
  input: cn(
    "flex h-13 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
    "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
    "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  ),
}

export function PhoneInputComponent({
  label,
  name,
  placeholder = "Enter phone number",
  control,
  errors,
  withCountrySelect = true,
  required = false,
  international,
  defaultCountry = "KE",
  className,
}: PhoneInputComponentProps) {
  const rules = required ? { required: "Phone number is required" } : {}
  const hasError = !!errors?.[name]

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={name} className={hasError ? "text-destructive" : ""}>
          {label}
          {required && <span className=" ml-1">*</span>}
        </Label>
      )}

      {withCountrySelect ? (
        <PhoneInputWithCountry
          name={name}
          control={control}
          rules={rules}
          defaultCountry={defaultCountry}
          placeholder={placeholder}
          international={international}
          inputComponent={Input}
          className={cn(phoneInputStyles.input, className, hasError && "border-destructive focus-visible:ring-destructive")}
        />
      ) : (
        <PhoneInputBasic
          name={name}
          control={control}
          rules={rules}
          defaultCountry={defaultCountry}
          placeholder={placeholder}
          international={international}
          className={cn(phoneInputStyles.input, className, hasError && "border-destructive focus-visible:ring-destructive")}
        />
      )}

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
