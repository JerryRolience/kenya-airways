import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@hookform/error-message"
import { EyeOff, Eye } from "lucide-react"
import { useState } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import { formatErrorMessage } from "./utils/format-error-message"

interface InputTextComponentProps {
  label?: string
  name: string
  type?: "text" | "email" | "password" | "number" | "date"
  placeholder?: string
  required?: boolean
  helperText?: string
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
}

export function InputTextComponent({ label, name, type, placeholder, required, helperText, register, errors }: InputTextComponentProps) {
  const [showPassword, setShowPassword] = useState(false)
  const hasError = !!errors?.[name]

  const onTogglePassword = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={`input-${name}`} className={hasError ? "text-destructive" : ""}>
          {label}
          {required && <span className=" ml-1">*</span>}
        </Label>
      )}

      <div className="relative">
        <Input
          id={`input-${name}`}
          type={type === "password" ? (showPassword ? "text" : "password") : type === "number" ? "number" : "text"}
          placeholder={placeholder}
          className={`h-10 rounded-lg bg-background ${hasError ? "border-destructive" : ""}`}
          {...register?.(name)}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={onTogglePassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {helperText && <p className="text-sm text-muted-foreground mt-1">{helperText}</p>}
      </div>

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
