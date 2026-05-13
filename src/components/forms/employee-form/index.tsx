"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CREATE_EMPLOYEE_FORM, UPDATE_EMPLOYEE_FORM } from "@/constants/employee"
import { useAddEmployee } from "@/hooks/employee/use-add-employee"
import { EmployeeListItem } from "@/types/employee"
import { FormGenerator } from "../form-generator"
import { FormDebug } from "../form-generator/utils/form-debug"

interface AddEmployeeFormProps {
  employee?: EmployeeListItem
  open: boolean
  setOpen: (val: boolean) => void
}

export function AddEmployeeForm({ employee, open, setOpen }: AddEmployeeFormProps) {
  const { register, control, errors, onSubmit, isPending, reset } = useAddEmployee(() => setOpen(false), employee)

  const handleOpenChange = (val: boolean) => {
    if (!val) reset()
    setOpen(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-lg font-semibold">{employee ? "Edit Employee" : "Register New Employee"}</DialogTitle>
          <DialogDescription>Fill in the employee details below. Fields marked with * are required.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <form onSubmit={onSubmit} className="px-6 py-6 flex flex-col gap-6">
            {/* Form Generator */}
            {employee
              ? UPDATE_EMPLOYEE_FORM.map(field => {
                  return (
                    <div key={field.id} className="flex flex-col gap-4">
                      <FormGenerator
                        key={field.id}
                        inputType={field.inputType}
                        type={field.type}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        register={register}
                        control={control as any}
                        errors={errors}
                        lines={field.lines}
                        maxDate={field.maxDate}
                        options={field.options}
                        switchDescription={field.switchDescription}
                      />
                    </div>
                  )
                })
              : CREATE_EMPLOYEE_FORM.map(field => {
                  return (
                    <div key={field.id} className="flex flex-col gap-4">
                      <FormGenerator
                        key={field.id}
                        inputType={field.inputType}
                        type={field.type}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        register={register}
                        control={control as any}
                        errors={errors}
                        lines={field.lines}
                        maxDate={field.maxDate}
                        options={field.options}
                        switchDescription={field.switchDescription}
                      />
                    </div>
                  )
                })}

            {/* Form Debug */}
            <FormDebug errors={errors} />

            <div className="flex gap-3 pt-2 pb-2">
              <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => handleOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-10 btn-primary" disabled={isPending}>
                <Loader loading={isPending}>{employee ? "Update Employee" : "Register Employee"}</Loader>
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
