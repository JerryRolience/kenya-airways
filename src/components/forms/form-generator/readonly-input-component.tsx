import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "@hookform/error-message"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"

interface ReadonlyInputComponentProps {
  label?: string
  name: string
  readonlyValue?: string
  readOnlySubmitValue?: string
  register?: UseFormRegister<FieldValues>
  errors?: FieldErrors<FieldValues>
}

export function ReadonlyInputComponent({ label, name, readonlyValue, readOnlySubmitValue, register, errors }: ReadonlyInputComponentProps) {
  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={`readonly-${name}`}>{label}</Label>}

      {/* Display field (non-interactive) */}
      <Input
        id={`readonly-${name}`}
        value={readonlyValue || ""}
        readOnly
        disabled
        className="h-10 rounded-lg bg-muted cursor-not-allowed opacity-70"
      />

      {/* Hidden field to submit the value */}
      <input type="hidden" {...register?.(name)} value={readOnlySubmitValue || readonlyValue || ""} />

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <p className="text-destructive text-sm mt-1">{message === "Required" ? "" : message}</p>}
      />
    </div>
  )
}
