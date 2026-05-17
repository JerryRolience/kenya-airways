"use client"

import { Button } from "@/components/ui/button"
import { useFetchMyPassengerProfile } from "@/hooks/passenger/use-fetch-passenger-profile"
import { cn } from "@/lib/utils"
import { PassengerFormValues } from "@/validators/booking"
import { Check, ChevronDown, ChevronUp, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { PassengerRelation } from "../../../generated/prisma/enums"
import { PassengerForm, PassengerFormHandle } from "../forms/booking-form"
import { ErrorHandler } from "../global/error-handler"

interface PassengerStepProps {
  passengerCount: number
  initialPassengers?: PassengerFormValues[]
  onComplete: (passengers: PassengerFormValues[]) => void
  onBack: () => void
}

export function PassengerStep({ passengerCount, initialPassengers = [], onComplete, onBack }: PassengerStepProps) {
  const { data: profileResponse } = useFetchMyPassengerProfile()
  const myProfile = profileResponse?.data

  const [openIndex, setOpenIndex] = useState<number>(0)

  // Store passenger data as it's confirmed
  const [passengerData, setPassengerData] = useState<Partial<PassengerFormValues>[]>(() => (initialPassengers.length > 0 ? initialPassengers : Array(passengerCount).fill(null)))

  const [confirmed, setConfirmed] = useState<boolean[]>(() => {
    if (initialPassengers.length > 0) {
      return initialPassengers.map(() => true).concat(Array(passengerCount - initialPassengers.length).fill(false))
    }
    return Array(passengerCount).fill(false)
  })

  const formRefs = useRef<(PassengerFormHandle | null)[]>(Array(passengerCount).fill(null))

  const getMyDetails = (): Partial<PassengerFormValues> => {
    if (myProfile) {
      return {
        firstName: myProfile.firstName || "",
        lastName: myProfile.lastName || "",
        email: myProfile.email || "",
        phone: myProfile.phone || "",
        title: myProfile.title,
        passportNumber: myProfile.passportNumber || "",
        nationality: myProfile.nationality || "",
        dateOfBirth: myProfile.dateOfBirth,
        relationship: PassengerRelation.SELF,
      }
    }
    return { relationship: PassengerRelation.SELF }
  }

  //  Validate AND save passenger data
  const handleConfirmPassenger = async (index: number) => {
    const formRef = formRefs.current[index]
    if (!formRef) {
      ErrorHandler({ title: "Form not ready. Please try again.", action: "error" })
      return
    }

    const valid = await formRef.validate()
    if (!valid) {
      ErrorHandler({ title: "Please fill in all required fields correctly.", action: "error" })
      return
    }

    //  SAVE the passenger data immediately
    const values = formRef.getValues()
    const updatedData = [...passengerData]
    updatedData[index] = values
    setPassengerData(updatedData)

    // Mark as confirmed
    const next = [...confirmed]
    next[index] = true
    setConfirmed(next)

    ErrorHandler({ title: `Passenger ${index + 1} confirmed.`, action: "success" })

    // Auto-open next passenger
    if (index < passengerCount - 1) {
      setOpenIndex(index + 1)
    }
  }

  //  Use saved data when continuing
  const handleContinue = async () => {
    const results: PassengerFormValues[] = []
    let allValid = true
    let firstInvalidIndex = -1

    for (let i = 0; i < passengerCount; i++) {
      // If already confirmed, use saved data
      if (confirmed[i] && passengerData[i]) {
        results.push(passengerData[i] as PassengerFormValues)
        continue
      }

      // Otherwise validate and get from form
      const formRef = formRefs.current[i]
      if (!formRef) {
        allValid = false
        if (firstInvalidIndex === -1) firstInvalidIndex = i
        continue
      }

      const valid = await formRef.validate()
      if (!valid) {
        allValid = false
        if (firstInvalidIndex === -1) firstInvalidIndex = i
        continue
      }
      results.push(formRef.getValues())
    }

    if (!allValid) {
      setOpenIndex(firstInvalidIndex)
      ErrorHandler({ title: `Please complete all fields for Passenger ${firstInvalidIndex + 1}.`, action: "error" })
      return
    }

    onComplete(results)
  }

  useEffect(() => {
    const firstUnconfirmed = confirmed.findIndex(c => !c)
    if (firstUnconfirmed >= 0) {
      setOpenIndex(firstUnconfirmed)
    } else {
      setOpenIndex(passengerCount - 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allConfirmed = confirmed.every(c => c)

  return (
    <div className="space-y-4">
      {Array.from({ length: passengerCount }, (_, i) => {
        const isOpen = openIndex === i
        const isConfirmed = confirmed[i]
        const hasSavedData = !!passengerData[i]

        return (
          <div
            key={i}
            className={cn(
              "rounded-2xl border overflow-hidden transition-all duration-200",
              isOpen ? "border-primary/30 shadow-sm" : isConfirmed ? "border-emerald-200/60 dark:border-emerald-900/40" : "border-border/60",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className={cn("w-full flex items-center justify-between px-5 py-4 text-left transition-colors", isOpen ? "bg-primary/5" : "bg-card hover:bg-muted/30")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full shrink-0",
                    isConfirmed ? "bg-emerald-500 text-white" : isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {isConfirmed ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : <User className="h-3.5 w-3.5" />}
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Passenger {i + 1}
                    {i === 0 && <span className="ml-2 text-[10px] font-normal text-muted-foreground">(lead passenger)</span>}
                  </p>
                  {isConfirmed && !isOpen && hasSavedData && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {passengerData[i]?.firstName} {passengerData[i]?.lastName} — Details confirmed ✓
                    </p>
                  )}
                  {isConfirmed && !isOpen && !hasSavedData && <p className="text-xs text-muted-foreground mt-0.5">Details confirmed ✓</p>}
                </div>
              </div>

              {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-4 border-t border-border/50 bg-card">
                <PassengerForm
                  ref={el => {
                    formRefs.current[i] = el
                  }}
                  index={i}
                  defaultValues={passengerData[i] || undefined}
                  onUseMyDetails={i === 0 ? getMyDetails : undefined}
                />

                <div className="mt-5 flex justify-end">
                  <Button type="button" size="sm" onClick={() => handleConfirmPassenger(i)} className="rounded-xl h-9 px-5 text-xs font-semibold hover:cursor-pointer">
                    {isConfirmed ? "Update passenger" : i === passengerCount - 1 ? "Done" : `Confirm passenger ${i + 1}`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} className="rounded-xl text-sm text-muted-foreground hover:text-foreground hover:cursor-pointer">
          ← Back to flights
        </Button>

        <Button
          type="button"
          onClick={handleContinue}
          disabled={!allConfirmed}
          className={cn(
            "rounded-xl h-11 px-6 text-sm font-semibold transition-all hover:cursor-pointer",
            allConfirmed ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {allConfirmed ? "Continue to seat selection →" : `Confirm all ${passengerCount} passengers`}
        </Button>
      </div>
    </div>
  )
}
