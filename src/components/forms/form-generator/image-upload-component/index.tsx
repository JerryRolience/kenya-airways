"use client";

import { ErrorMessage } from "@hookform/error-message";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";
import { FieldLabel } from "../utils/field-label";
import { formatErrorMessage } from "../utils/format-error-message";
import { ImageUpload } from "./image-upload";

interface ImageUploadComponentProps {
  label: string;
  name: string;
  required?: boolean;
  control?: Control<FieldValues>;
  errors?: FieldErrors<FieldValues>;
  setError?: UseFormSetError<FieldValues>;
  clearErrors?: UseFormClearErrors<FieldValues>;
}

export function ImageUploadComponent({
  label,
  name,
  required,
  control,
  errors,
  setError,
  clearErrors,
}: ImageUploadComponentProps) {
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
        name={name}
        control={control}
        render={({ field }) => (
          <ImageUpload
            name={name}
            field={field}
            errors={errors}
            setError={setError}
            clearErrors={clearErrors}
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
                name.charAt(0).toUpperCase() + name.slice(1),
              )}
            </p>
          )}
        />
      )}
    </div>
  );
}
