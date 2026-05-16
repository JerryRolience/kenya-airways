"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, XCircle, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface CancelBookingDialogProps {
  // Booking info
  bookingReference: string
  flightNumber: string
  isReturnTrip?: boolean
  paymentStatus: string

  // Control
  open: boolean
  onOpenChange: (open: boolean) => void

  // Action
  onConfirm: (reason?: string) => Promise<void> | void
  isPending?: boolean
}

export function CancelBookingDialog({ bookingReference, flightNumber, isReturnTrip = false, paymentStatus, open, onOpenChange, onConfirm, isPending: externalPending }: CancelBookingDialogProps) {
  const [reason, setReason] = useState("")
  const [internalPending, setInternalPending] = useState(false)

  const isPending = externalPending ?? internalPending
  const isPaid = paymentStatus === "PAID"

  const handleConfirm = async () => {
    if (!externalPending) setInternalPending(true)
    try {
      await onConfirm(reason.trim() || undefined)
      setReason("")
      onOpenChange(false)
    } finally {
      if (!externalPending) setInternalPending(false)
    }
  }

  const handleCancel = () => {
    setReason("")
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 shrink-0">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-base">Cancel Booking</AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                Booking {bookingReference} · Flight {flightNumber}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          {/* Warning about refund */}
          <div className={cn("rounded-xl border p-3 text-xs flex items-start gap-2", isPaid ? "border-amber-200 bg-amber-50 text-amber-700" : "border-border/60 bg-muted/30 text-muted-foreground")}>
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              {isPaid ? (
                <>
                  <p className="font-medium">Refund policy applies</p>
                  <p className="mt-0.5">
                    This booking is paid. A refund will be processed according to our cancellation policy based on your fare class.
                    {isReturnTrip && " Both outbound and return flights will be cancelled."}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Booking will be cancelled</p>
                  <p className="mt-0.5">This action cannot be undone. Your seat(s) will be released and may be booked by other passengers.</p>
                </>
              )}
            </div>
          </div>

          {/* Reason (optional) */}
          <div className="space-y-2">
            <Label className="text-xs font-medium">
              Reason for cancellation <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Tell us why you're cancelling this booking..."
              className="min-h-24 rounded-xl resize-none text-sm"
              maxLength={500}
              disabled={isPending}
            />
            <p className="text-[10px] text-muted-foreground text-right">{reason.length}/500</p>
          </div>
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isPending} onClick={handleCancel} className="flex-1 rounded-xl hover:cursor-pointer">
            Keep Booking
          </AlertDialogCancel>
          <Button variant="destructive" className="flex-1 gap-2 rounded-xl hover:cursor-pointer" onClick={handleConfirm} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Cancel Booking
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
