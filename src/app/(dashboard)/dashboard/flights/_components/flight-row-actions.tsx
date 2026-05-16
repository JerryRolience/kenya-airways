"use client"

import { CancelBookingDialog } from "@/components/global/dialogs/cancel-booking-dialog"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCancelBooking } from "@/hooks/booking/use-cancel-booking"
import { UserFlight } from "@/types/flights"
import { Eye, MoreHorizontal, Ticket, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BookingStatus } from "../../../../../../generated/prisma/enums"

interface FlightRowActionsProps {
  flight: UserFlight
}

export function FlightRowActions({ flight }: FlightRowActionsProps) {
  const router = useRouter()
  const [cancelOpen, setCancelOpen] = useState(false)

  const { isPending, onCancelBooking } = useCancelBooking({})

  const isActive = flight.bookingStatus === BookingStatus.CONFIRMED || flight.bookingStatus === BookingStatus.PENDING

  const handleViewBooking = () => {
    router.push(`/dashboard/bookings/${flight.bookingId}`)
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
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={handleViewBooking}>
            <Eye className="mr-2 h-3.5 w-3.5" />
            View booking
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs hover:cursor-pointer" onClick={() => router.push(`/dashboard/bookings/${flight.bookingId}`)}>
            <Ticket className="mr-2 h-3.5 w-3.5" />
            View ticket
          </DropdownMenuItem>

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

      {/* Cancel Booking Dialog */}
      <CancelBookingDialog
        bookingReference={flight.bookingReference}
        flightNumber={flight.flightNumber}
        isReturnTrip={flight.isReturnTrip}
        paymentStatus={flight.paymentStatus}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        isPending={isPending}
        onConfirm={reason => onCancelBooking({ bookingId: flight.bookingId, reason })}
      />
    </>
  )
}
