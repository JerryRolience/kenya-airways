"use client"

import { Plane } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PaymentsTable } from "./_components/payments-table"

export default function PaymentsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">Payment History</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">View your payment transactions and receipts</p>
        </div>

        <div className="self-start sm:self-auto shrink-0">
          <Link href="/#booking-card" scroll={true}>
            <Button className="btn-primary h-9 gap-2 hover:cursor-pointer">
              <Plane className="h-4 w-4 -rotate-45" />
              Book a Flight
            </Button>
          </Link>
        </div>
      </div>

      {/* Payments table */}
      <PaymentsTable />
    </div>
  )
}
