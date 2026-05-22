"use client"

import { ChangeBookingForm } from "@/components/forms/booking-form/change-booking-form"
import { CancelBookingDialog } from "@/components/global/dialogs/cancel-booking-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCancelBooking } from "@/hooks/booking/use-cancel-booking"
import { BookingListItem } from "@/types/booking"
import { Edit, Eye, MoreHorizontal, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BookingStatus } from "../../../../../../generated/prisma/enums"

interface BookingRowActionsProps {
  booking: BookingListItem
}

export function BookingRowActions({ booking }: BookingRowActionsProps) {
  const router = useRouter()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [changeDialogOpen, setChangeDialogOpen] = useState(false)

  const { isPending, onCancelBooking } = useCancelBooking({})

  const isActive = booking.status === BookingStatus.CONFIRMED || booking.status === BookingStatus.PENDING

  const handleViewDetails = () => {
    router.push(`/dashboard/bookings/${booking.reference}`)
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
              <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => setChangeDialogOpen(true)}>
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
      <CancelBookingDialog
        bookingReference={booking.reference}
        flightNumber={booking.outboundFlight.flightNumber}
        isReturnTrip={booking.isReturnTrip}
        paymentStatus={booking.paymentStatus}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        isPending={isPending}
        onConfirm={reason => onCancelBooking({ bookingId: booking.id, reason })}
      />

      <ChangeBookingForm booking={booking} open={changeDialogOpen} setOpen={setChangeDialogOpen} />
    </>
  )
}
