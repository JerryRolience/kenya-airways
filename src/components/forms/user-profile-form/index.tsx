"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UPDATE_USER_FORM } from "@/constants/user-profile"
import { ProfileData } from "@/types/profile"
import { FormGenerator } from "../form-generator"
import { FormDebug } from "../form-generator/utils/form-debug"
import { useUpdateUserProfile } from "@/hooks/profile/use-update-user-profile"

interface UserProfileFormProps {
  user: ProfileData
  open: boolean
  setOpen: (val: boolean) => void
}

export function UserProfileForm({ user, open, setOpen }: UserProfileFormProps) {
  const { register, control, errors, onSubmit, isPending, reset } = useUpdateUserProfile({ profile: user, onSuccess: () => setOpen(false) })

  const handleOpenChange = (val: boolean) => {
    if (!val) reset()
    setOpen(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-lg font-semibold">Edit User</DialogTitle>
          <DialogDescription>Update your user details below.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <form onSubmit={onSubmit} className="px-6 py-6 flex flex-col gap-6">
            {/* Form Generator */}
            {UPDATE_USER_FORM.map(field => {
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
                <Loader loading={isPending}>{isPending ? "Updating..." : "Update User"}</Loader>
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
