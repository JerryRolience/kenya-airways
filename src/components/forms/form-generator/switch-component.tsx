import { Switch } from "@/components/ui/switch";
import { ErrorMessage } from "@hookform/error-message";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import { FieldLabel } from "./utils/field-label";
import { formatErrorMessage } from "./utils/format-error-message";

interface SwitchComponentProps {
  label: string;
  name: string;
  required?: boolean;
  switchDescription?: string;
  control?: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
}

export function SwitchComponent({
  label,
  name,
  switchDescription,
  control,
  errors,
  required,
}: SwitchComponentProps) {
  const hasError = !!errors?.[name];

  return (
    <div className="grid gap-2">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="grid gap-1">
              
              <FieldLabel
                label={label}
                name={name}
                hasError={hasError}
                required={required}
              />

              {switchDescription && (
                <p className="text-xs text-muted-foreground">
                  {switchDescription}
                </p>
              )}
            </div>
            <Switch
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
              className={hasError ? "border-destructive ring-destructive" : ""}
            />
          </div>
        )}
      />

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
