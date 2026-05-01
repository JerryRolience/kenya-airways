"use client"

import { FieldErrors, FieldValues } from "react-hook-form"

export function FormDebug({ errors }: { errors: FieldErrors<FieldValues> }) {
  if (process.env.NODE_ENV !== "development") return null
  if (Object.keys(errors).length === 0) return null

  return (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-xs font-mono space-y-1">
      <p className="font-semibold text-destructive text-[11px] uppercase tracking-wider mb-2">Form validation errors</p>
      {Object.entries(errors).map(([field, error]) => (
        <div key={field} className="flex gap-2">
          <span className="text-destructive font-bold shrink-0">{field}:</span>
          <span className="text-muted-foreground">{(error as any)?.message ?? "Invalid"}</span>
        </div>
      ))}
    </div>
  )
}
