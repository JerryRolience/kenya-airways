"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, ImageUp, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";

//  Constants
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "gif", "avif"];

interface ImageUploadProps {
  name: string;
  field: ControllerRenderProps<FieldValues, string>;
  errors?: FieldErrors<FieldValues>;
  setError?: UseFormSetError<FieldValues>;
  clearErrors?: UseFormClearErrors<FieldValues>;
}

export function ImageUpload({
  name,
  field,
  errors,
  setError,
  clearErrors,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Compute initial state directly from field.value to handle both existing URLs and new File objects
  // field.value is either a File (newly selected) or string URL (existing/uploaded)
  const initialValue = field.value;
  const isExistingImage = !!(typeof initialValue === "string" && initialValue);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    isExistingImage ? initialValue : null,
  );
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(isExistingImage);

  // Revoke object URL on unmount — prevents memory leaks
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  //  Validation
  const validateFile = useCallback((f: File): string | null => {
    if (f.size === 0) return "The file is empty.";
    if (f.size > MAX_SIZE_BYTES) {
      return `File size (${(f.size / 1024 / 1024).toFixed(1)}MB) exceeds the ${MAX_SIZE_MB}MB limit.`;
    }
    if (!ALLOWED_TYPES.includes(f.type)) {
      return "File type not supported. Use JPG, PNG, WebP, GIF, or AVIF.";
    }
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    console.log("Validating file:", {
      name: f.name,
      type: f.type,
      size: f.size,
      ext,
    });
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `File extension ".${ext}" is not supported.`;
    }
    return null;
  }, []);

  //  Handle file selection
  const handleFile = useCallback(
    (f: File) => {
      const validationError = validateFile(f);

      if (validationError) {
        setLocalError(validationError);
        setError?.(name, { type: "manual", message: validationError });
        return;
      }

      // Clear previous errors and state
      setLocalError(null);
      setIsUploaded(false);
      clearErrors?.(name);

      // Revoke old object URL to free memory
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const objectUrl = URL.createObjectURL(f);
      console.log("Selected file:", {
        name: f.name,
        type: f.type,
        size: f.size,
        objectUrl,
      });
      objectUrlRef.current = objectUrl;

      setFile(f);
      setPreview(objectUrl);

      // Store the File object in RHF
      // The parent form's onSubmit will upload it and replace this
      // with the Cloudinary URL before calling the server action
      field.onChange(f);
    },
    [validateFile, name, field, setError, clearErrors],
  );

  //  Clear
  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      setFile(null);
      setPreview(null);
      setLocalError(null);
      setIsUploaded(false);
      clearErrors?.(name);
      field.onChange(null);

      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    },
    [name, clearErrors, field],
  );

  //  Input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      // Reset so same file can be re-selected after clearing
      e.target.value = "";
    },
    [handleFile],
  );

  //  Drag and drop
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);

      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  //  Display error — local validation takes priority over RHF
  const rhfError = errors?.[name]?.message as string | undefined;
  const displayError = localError ?? rhfError;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload image"
          className={cn(
            "relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-all duration-200 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            dragging
              ? "border-primary bg-primary/5 scale-[1.005]"
              : "border-input hover:bg-accent/50",
            displayError && "border-destructive",
            isUploaded && !displayError && "border-emerald-500",
          )}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              inputRef.current?.click();
            }
          }}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            id={name}
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            className="hidden"
            onChange={handleInputChange}
          />

          {preview ? (
            //  Preview
            <div className="absolute inset-0">
              <Image
                src={preview}
                alt="Selected file preview"
                className="w-full h-full object-cover"
              />
              {/* Uploaded badge */}
              {isUploaded && (
                <div className="absolute top-2 left-2">
                  <div className="flex items-center gap-1 bg-emerald-600/90 text-white text-xs rounded-full px-2 py-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Uploaded
                  </div>
                </div>
              )}
              {/* File name at bottom */}
              {file && (
                <div className="absolute bottom-0 inset-x-0 bg-black/50 px-3 py-1.5">
                  <p className="text-white text-xs truncate">{file.name}</p>
                  <p className="text-white/70 text-xs">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            //  Empty state
            <div className="flex flex-col items-center text-center gap-2">
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full border transition-colors",
                  dragging
                    ? "border-primary bg-primary/10"
                    : "border-input bg-background",
                )}
              >
                <ImageUp
                  className={cn(
                    "h-5 w-5 transition-colors",
                    dragging
                      ? "text-primary"
                      : "text-muted-foreground opacity-60",
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {dragging
                    ? "Drop to select"
                    : "Drop your image here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  JPG, PNG, WebP, GIF, AVIF · Max {MAX_SIZE_MB}MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Clear button — shown when there is a preview */}
        {preview && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Remove selected file"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Error display — below drop zone, above file info */}
      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}
