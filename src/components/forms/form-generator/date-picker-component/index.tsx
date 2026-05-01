"use client";

import { ErrorMessage } from "@hookform/error-message";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import { FieldLabel } from "../utils/field-label";
import { formatErrorMessage } from "../utils/format-error-message";
import { DatePicker } from "./date-picker";

interface DatePickerComponentProps {
  label: string;
  name: string;
  placeholder?: string;
  maxDate?: string;
  minDate?: string;
  control?: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  required?: boolean;
}

export function DatePickerComponent({
  label,
  name,
  placeholder,
  maxDate,
  minDate,
  control,
  errors,
  required,
}: DatePickerComponentProps) {
  const hasError = !!errors?.[name];

  return (
    <div className="grid gap-2">
      <FieldLabel
        label={label}
        name={name}
        hasError={hasError}
        required={required}
      />

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            placeholder={placeholder}
            maxDate={maxDate}
            minDate={minDate}
            hasError={hasError}
            field={field}
          />
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
