// components/forms/match-form.tsx
"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MATCH_FORM } from "@/constants/match"
import { FormGenerator } from "../form-generator"
import { FormDebug } from "../form-generator/utils/form-debug"
import { useMemo } from "react"
import { useAddMatchForm } from "@/hooks/matches/use-add-match"

interface MatchFormProps {
  open: boolean
  setOpen: (val: boolean) => void
}

export function MatchForm({ open, setOpen }: MatchFormProps) {
  const { register, control, errors, onSubmit, isPending, reset, openingOptions, employeeOptions, openingsLoading, employeesLoading, selectedOpeningId } = useAddMatchForm(() => setOpen(false))

  const handleOpenChange = (val: boolean) => {
    if (!val) reset()
    setOpen(val)
  }

  // Dynamically build form fields with options
  const formFields = useMemo(() => {
    return MATCH_FORM.map(field => {
      if (field.name === "openingId") {
        return {
          ...field,
          options: openingOptions,
        }
      }
      if (field.name === "employeeId") {
        return {
          ...field,
          options: employeeOptions,
          placeholder: selectedOpeningId ? (employeesLoading ? "Loading employees..." : employeeOptions.length === 0 ? "No available employees" : "Select an employee") : "Select an opening first",
        }
      }
      return field
    })
  }, [openingOptions, employeeOptions, employeesLoading, selectedOpeningId])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-lg font-semibold">Match Employee to Opening</DialogTitle>
          <DialogDescription>Select a job opening and an employee to create a match. Fields marked with * are required.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <form onSubmit={onSubmit} className="px-6 py-6 flex flex-col gap-6">
            {formFields.map(field => (
              <div key={field.id} className="flex flex-col gap-4">
                <FormGenerator
                  inputType={field.inputType}
                  type={field.type}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  register={register}
                  control={control as any}
                  errors={errors}
                  lines={field.lines}
                  options={field.options}
                  required={field.required}
                />
                {/* Show helper text for employee field */}
                {field.name === "employeeId" && selectedOpeningId && !employeesLoading && employeeOptions.length === 0 && (
                  <p className="text-[11px] text-amber-600 -mt-2">All employees in this department are already matched to this opening.</p>
                )}
                {field.name === "employeeId" && !selectedOpeningId && <p className="text-[11px] text-muted-foreground -mt-2">Select a job opening first to see available employees.</p>}
              </div>
            ))}

            <FormDebug errors={errors} />

            <div className="flex gap-3 pt-2 pb-2">
              <Button type="button" variant="outline" className="flex-1 h-10 rounded-xl hover:cursor-pointer" onClick={() => handleOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-10 btn-primary rounded-xl hover:cursor-pointer" disabled={isPending || openingsLoading}>
                <Loader loading={isPending}>Create Match</Loader>
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
