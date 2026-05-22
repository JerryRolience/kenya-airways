"use client"

import { Loader } from "@/components/global/loader"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CHANGE_BOOKING_FORM } from "@/constants/booking"
import { useChangeBooking } from "@/hooks/booking/use-change-booking"
import { BookingDetail, BookingListItem } from "@/types/booking"
import { FormGenerator } from "../form-generator"
import { FormDebug } from "../form-generator/utils/form-debug"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

interface ChangeBookingFormProps {
  booking: BookingDetail | BookingListItem
  open: boolean
  setOpen: (val: boolean) => void
}

export function ChangeBookingForm({ booking, open, setOpen }: ChangeBookingFormProps) {
  const { register, control, errors, watch, onSubmit, isPending, reset, flightOptions, seatClassOptions, flightsLoading, classType, currentBookingInfo } = useChangeBooking({
    booking,
    onSuccess: () => setOpen(false),
  })

  const fareDifference = watch("fareDifference")

  const handleOpenChange = (val: boolean) => {
    if (!val) reset()
    setOpen(val)
  }

  const formFields = useMemo(() => {
    return CHANGE_BOOKING_FORM.map(field => {
      if (field.name === "newFlightId") {
        return { ...field, options: flightOptions }
      }
      if (field.name === "newSeatClassId") {
        return { ...field, options: seatClassOptions }
      }
      return field
    })
  }, [flightOptions, seatClassOptions])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-lg font-semibold">Change Booking</DialogTitle>
          <DialogDescription>
            Select a new flight for booking <span className="font-mono font-medium text-foreground">{booking.reference}</span>. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <form onSubmit={onSubmit} className="px-6 py-6 flex flex-col gap-5">
            {/* Current booking info */}
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">Current Booking</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  Flight: <span className="font-medium text-foreground">{currentBookingInfo.flightNumber}</span>
                </p>
                <p>
                  Route:{" "}
                  <span className="font-medium text-foreground">
                    {currentBookingInfo.fromCity} → {currentBookingInfo.toCity}
                  </span>
                </p>
                <p>
                  Class: <span className="font-medium text-foreground capitalize">{classType.toLowerCase()}</span>
                </p>
                <p>
                  Total paid: <span className="font-medium text-foreground">KES {currentBookingInfo.totalAmount.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {formFields.map(field => (
              <div key={field.id} className="flex flex-col gap-2">
                <FormGenerator
                  inputType={field.inputType}
                  type={field.type}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  register={register}
                  control={control as any}
                  errors={errors}
                  options={field.options}
                  required={field.required}
                  helperText={field.helperText}
                />
              </div>
            ))}

            {/* Fare difference display */}
            {fareDifference !== 0 && (
              <div className={cn("rounded-xl border p-4 text-center", fareDifference > 0 ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700")}>
                <p className="text-xs font-semibold">{fareDifference > 0 ? "Additional amount to pay" : "Refund amount"}</p>
                <p className="text-lg font-bold mt-1">KES {Math.abs(fareDifference).toLocaleString()}</p>
              </div>
            )}

            <FormDebug errors={errors} />

            <div className="flex gap-3 pt-2 pb-2">
              <Button type="button" variant="outline" className="flex-1 h-10 rounded-xl hover:cursor-pointer" onClick={() => handleOpenChange(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-10 btn-primary rounded-xl hover:cursor-pointer" disabled={isPending || flightsLoading}>
                <Loader loading={isPending}>Change Booking</Loader>
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
