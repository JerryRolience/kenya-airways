"use client";

import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@hookform/error-message";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import { Option } from "../types";
import { formatErrorMessage } from "../utils/format-error-message";
import { MultiSelect } from "./multi-select";

interface MultiSelectComponentProps {
  label: string;
  name: string;
  placeholder?: string;
  multiselectPlaceholder?: string;
  options?: Option[];
  required?: boolean;
  control?: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
}

export function MultiSelectComponent({
  label,
  name,
  placeholder,
  multiselectPlaceholder,
  options = [],
  required = false,
  control,
  errors,
}: MultiSelectComponentProps) {
  const hasError = !!errors?.[name];

  return (
    <div className="grid gap-2">
      {label && (
        <Label htmlFor={name} className={hasError ? "text-destructive" : ""}>
          {label}
          {required && <span className=" ml-1">*</span>}
        </Label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <MultiSelect
            label={label}
            placeholder={placeholder}
            multiselectPlaceholder={multiselectPlaceholder}
            options={options}
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
