"use client"

import { FormGenerator } from "@/components/forms/form-generator"
import { Option } from "@/components/forms/form-generator/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useSearchFlight } from "@/hooks/flight/search-flight"
import { useFetchAirports } from "@/hooks/airport/use-fetch-airports"
import { cn } from "@/lib/utils"
import { ArrowLeftRight, CalendarIcon, Loader2, MapPin, Plane, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { ClassType } from "../../../../generated/prisma/enums"
import { TripType } from "@/types/flights"

const cabinClasses = [
  { value: ClassType.EXECUTIVE, label: "Executive", sub: "Class A" },
  { value: ClassType.MIDDLE, label: "Middle", sub: "Class B" },
  { value: ClassType.ECONOMY, label: "Economy", sub: "Class C" },
]

const TRIP_TYPE_OPTIONS = [
  { value: "one-way", label: "One Way" },
  { value: "return", label: "Return" },
]
interface BookingCardProps {
  prefillDestination?: {
    from: string
    to: string
  } | null
}

export function BookingCard({ prefillDestination }: BookingCardProps) {
  const [tripType, setTripType] = useState<TripType>("one-way")
  const { onSubmit, control, errors, isPending, register, setValue, watch } = useSearchFlight()

  const { data: airportsData, isLoading: airportsLoading } = useFetchAirports()

  // Watch for prefill changes
  useEffect(() => {
    if (prefillDestination) {
      setValue("from", prefillDestination.from)
      setValue("to", prefillDestination.to)
    }
  }, [prefillDestination, setValue])

  const airports: Option[] = airportsData?.data?.map(a => ({ value: a.code, label: a.label })) || []

  const fromValue = watch("from")
  const toValue = watch("to")

  const swap = () => {
    setValue("from", toValue)
    setValue("to", fromValue)
  }

  const handleTripTypeChange = (type: TripType) => {
    setTripType(type)
    setValue("tripType", type)
    if (type === "one-way") {
      setValue("returnDate", undefined)
    }
  }

  return (
    <Card className="shadow-elegant relative overflow-hidden border-border/60 bg-card/95 p-5 backdrop-blur-xl md:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <form className="relative space-y-5" onSubmit={onSubmit}>
        {/* Trip type toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1 w-fit">
          {TRIP_TYPE_OPTIONS.map(t => (
            <button
              type="button"
              key={t.value}
              onClick={() => handleTripTypeChange(t.value as TripType)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-[13px] font-medium capitalize transition-all duration-200",
                tripType === t.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* From / To row */}
        <div className="grid gap-4 md:grid-cols-12">
          <div className="md:col-span-5">
            <FormGenerator
              inputType="searchable-dropdown"
              type="text"
              name="from"
              label="From"
              icon={<MapPin className="h-3.5 w-3.5" />}
              placeholder="Select origin"
              options={airports}
              errors={errors}
              register={register}
              required={true}
              control={control as any}
            />
          </div>

          <div className="hidden items-end justify-center pb-1 md:col-span-1 md:flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={swap}
              className="rounded-full border-border bg-background shadow-elegant transition-transform hover:rotate-180"
              aria-label="Swap origin and destination"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="md:col-span-6">
            <FormGenerator
              inputType="searchable-dropdown"
              type="text"
              name="to"
              label="To"
              icon={<Plane className="h-3.5 w-3.5" />}
              placeholder="Select destination"
              options={airports.filter(a => a.value !== fromValue)}
              errors={errors}
              register={register}
              required={true}
              control={control as any}
            />
          </div>
        </div>

        {/* Dates + class + passengers */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div>
            <FormGenerator
              inputType="date"
              type="text"
              name="date"
              label="Departure"
              icon={<CalendarIcon className="h-3.5 w-3.5" />}
              errors={errors}
              register={register}
              required={true}
              control={control as any}
              minDate={((): string => {
                const d = new Date()
                return d.toISOString()
              })()}
            />
          </div>

          {tripType === "return" && (
            <div>
              <FormGenerator
                inputType="date"
                type="text"
                name="returnDate"
                label="Return"
                icon={<CalendarIcon className="h-3.5 w-3.5" />}
                errors={errors}
                register={register}
                required={true}
                control={control as any}
                minDate={((): string => {
                  const d = watch("date") || new Date()
                  return typeof d === "string" ? d : new Date(d).toISOString()
                })()}
              />
            </div>
          )}

          <div>
            <FormGenerator
              inputType="select"
              name="class"
              label="Class"
              options={cabinClasses.map(c => ({
                value: c.value,
                label: `${c.label} (${c.sub})`,
              }))}
              errors={errors}
              register={register}
              required={true}
              control={control as any}
            />
          </div>

          <div>
            <FormGenerator
              inputType="select"
              name="passengers"
              label="Passengers"
              options={[1, 2, 3, 4, 5, 6].map(n => ({
                value: String(n),
                label: `${n} ${n === 1 ? "passenger" : "passengers"}`,
              }))}
              errors={errors}
              register={register}
              required={true}
              control={control as any}
            />
          </div>
        </div>

        {/* Mobile swap */}
        <div className="md:hidden">
          <Button type="button" variant="outline" onClick={swap} className="w-full rounded-xl">
            <ArrowLeftRight className="mr-2 h-4 w-4" /> Swap cities
          </Button>
        </div>

        {/* Submit */}
        <Button type="submit" disabled={isPending || airportsLoading} className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> Search Flights
            </>
          )}
        </Button>
      </form>
    </Card>
  )
}
