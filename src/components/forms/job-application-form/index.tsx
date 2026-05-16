"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { JOB_APPLICATION_FORM } from "@/constants/job-application"
import { useApplyForJobOpening } from "@/hooks/job/use-apply-for-job-application"
import { Send, ArrowRight } from "lucide-react"
import Link from "next/link"
import { FormGenerator } from "../form-generator"
import { FormDebug } from "../form-generator/utils/form-debug"
import { useUser } from "@clerk/nextjs"

interface JobApplicationFormProps {
  openingId: string
  openingTitle: string
  open: boolean
  setOpen: (val: boolean) => void
  onSuccess: () => void
}

export function JobApplicationForm({ openingId, openingTitle, open, setOpen, onSuccess }: JobApplicationFormProps) {
  const { user, isLoaded } = useUser()

  const { register, errors, watch, onSubmit, isPending, reset } = useApplyForJobOpening({
    openingId,
    onSuccess: () => {
      reset()
      setOpen(false)
      onSuccess()
    },
  })

  const coverLetter = watch("coverLetter") || ""

  const handleOpenChange = (val: boolean) => {
    if (!val) reset()
    setOpen(val)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 max-h-[90vh] flex flex-col">
        {!isLoaded ? (
          /*  Loading State  */
          <div className="flex items-center justify-center py-20">
            <Loader loading={true}>
              <span className="text-sm text-muted-foreground">Loading application form...</span>
            </Loader>
          </div>
        ) : !user ? (
          /*  Not Logged In State  */
          <div className="p-8 text-center">
            <Send className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <h2 className="font-display text-xl font-bold text-foreground mt-4">Sign in to apply</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">You need to sign in or create an account to apply for this position.</p>
            <Link href="/auth">
              <Button className="mt-5 rounded-xl text-sm gap-2 hover:cursor-pointer">
                Sign in to continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" className="mt-2 text-xs hover:cursor-pointer" onClick={() => handleOpenChange(false)}>
              Maybe later
            </Button>
          </div>
        ) : (
          /*  Form State  */
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
              <DialogTitle className="text-lg font-semibold">Apply for {openingTitle}</DialogTitle>
              <DialogDescription>Fill in your application below. Fields marked with * are required.</DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 overflow-y-auto">
              <form onSubmit={onSubmit} className="px-6 py-6 flex flex-col gap-5">
                {JOB_APPLICATION_FORM.map(field => {
                  if (field.name === "openingId") {
                    return <input key={field.id} type="hidden" {...register("openingId")} value={openingId} />
                  }

                  return (
                    <div key={field.id} className="flex flex-col gap-2">
                      <FormGenerator
                        inputType={field.inputType}
                        type={field.type}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        register={register}
                        errors={errors}
                        lines={field.lines}
                        required={field.required}
                        helperText={field.helperText}
                      />
                      {field.name === "coverLetter" && <p className="text-[10px] text-muted-foreground text-right -mt-1">{coverLetter.length} / 3000</p>}
                    </div>
                  )
                })}

                <FormDebug errors={errors} />

                <div className="flex gap-3 pt-2 pb-2">
                  <Button type="button" variant="outline" className="flex-1 h-10 rounded-xl hover:cursor-pointer" onClick={() => handleOpenChange(false)} disabled={isPending}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 h-10 btn-primary rounded-xl hover:cursor-pointer" disabled={isPending}>
                    <Loader loading={isPending}>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Application
                    </Loader>
                  </Button>
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                  By submitting, you confirm that the information provided is accurate. We&apos;ll review your application and contact you if shortlisted.
                </p>
              </form>
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
