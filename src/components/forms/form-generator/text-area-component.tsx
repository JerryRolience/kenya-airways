import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@hookform/error-message";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { FieldLabel } from "./utils/field-label";
import { formatErrorMessage } from "./utils/format-error-message";

interface TextAreaComponentProps {
  label: string;
  name: string;
  lines?: number;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  register?: UseFormRegister<FieldValues>;
  errors?: FieldErrors<FieldValues>;
}

export function TextAreaComponent({
  name,
  label,
  lines,
  placeholder,
  required,
  helperText,
  register,
  errors,
}: TextAreaComponentProps) {
  const hasError = !!errors?.[name];

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel
        label={label}
        name={name}
        hasError={hasError}
        required={required}
      />

      <Textarea
        id={`textarea-${name}`}
        placeholder={placeholder}
        className={`resize-none bg-background ${hasError ? "border-destructive" : ""}`}
        {...register?.(name)}
        rows={lines}
      />

      {helperText && (
        <p className="text-sm text-muted-foreground mt-1">{helperText}</p>
      )}

      {errors && (
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="text-destructive text-sm mt-1">
              {formatErrorMessage(
                message,
                label ?? name.charAt(0).toUpperCase() + name.slice(1),
              )}
            </p>
          )}
        />
      )}
    </div>
  );
}
