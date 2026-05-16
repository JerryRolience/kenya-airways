"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DeleteAlertDialog } from "@/components/global/dialogs/delete-alert-dialog"
import { MoreHorizontal, Eye, Edit, XCircle } from "lucide-react"
import { useState } from "react"
import { BookingListItem } from "@/types/booking"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface BookingRowActionsProps {
  booking: BookingListItem
}

export function BookingRowActions({ booking }: BookingRowActionsProps) {
  const router = useRouter()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const isActive = booking.status === "CONFIRMED" || booking.status === "PENDING"
  const isCancelled = booking.status === "CANCELLED"

  const handleViewDetails = () => {
    router.push(`/dashboard/bookings/${booking.id}`)
  }

  const handleChangeBooking = () => {
    if (!isActive) {
      toast.error("Only active bookings can be modified.")
      return
    }
    router.push(`/dashboard/bookings/${booking.id}/change`)
  }

  const handleCancelBooking = async () => {
    setIsCancelling(true)
    try {
      // TODO: Call cancel booking server action
      // await cancelBooking(booking.id);
      toast.success("Booking cancelled successfully.")
      setCancelOpen(false)
    } catch (error) {
      toast.error("Failed to cancel booking.")
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={handleViewDetails}>
            <Eye className="mr-2 h-3.5 w-3.5" />
            View details
          </DropdownMenuItem>

          {isActive && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={handleChangeBooking}>
                <Edit className="mr-2 h-3.5 w-3.5" />
                Change booking
              </DropdownMenuItem>
            </>
          )}

          {isActive && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-xs text-destructive focus:text-destructive hover:cursor-pointer" onClick={() => setCancelOpen(true)}>
                <XCircle className="mr-2 h-3.5 w-3.5" />
                Cancel booking
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cancel Booking Confirmation Dialog */}
      <DeleteAlertDialog
        entityName={`booking ${booking.reference}`}
        entityType="booking"
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        isPending={isCancelling}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        description={`Are you sure you want to cancel booking ${booking.reference}? ${booking.paymentStatus === "PAID" ? "A refund will be processed according to our cancellation policy." : ""}`}
        confirmLabel="Cancel Booking"
        variant="destructive"
      />
    </>
  )
}
