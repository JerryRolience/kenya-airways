"use client"

import { SeatData } from "@/types/seat"
import { cn } from "@/lib/utils"
import { Crown, Sofa, Ticket } from "lucide-react"
import { useState, useEffect } from "react"
import { SeatLegend } from "./seat-legend"

interface SeatMapProps {
  flightNumber: string
  aircraftType: string
  classes: {
    class: string
    rows: number[]
    seats: SeatData[]
  }[]
  selectedSeats: Record<number, SeatData | null> // passengerIndex → seat
  onSeatSelect: (passengerIndex: number, seat: SeatData) => void
  onSeatDeselect: (passengerIndex: number) => void
  activeClass?: string // Pre-selected class from booking
  passengerCount: number
}

const CLASS_ICONS: Record<string, React.ElementType> = {
  EXECUTIVE: Crown,
  MIDDLE: Sofa,
  ECONOMY: Ticket,
}

const CLASS_LABELS: Record<string, string> = {
  EXECUTIVE: "Executive Class",
  MIDDLE: "Middle Class",
  ECONOMY: "Economy Class",
}

const CLASS_COLORS: Record<string, string> = {
  EXECUTIVE: "border-amber-400 bg-amber-50",
  MIDDLE: "border-blue-400 bg-blue-50",
  ECONOMY: "border-emerald-400 bg-emerald-50",
}

const CLASS_BADGE_COLORS: Record<string, string> = {
  EXECUTIVE: "bg-amber-50 border-amber-200 text-amber-700",
  MIDDLE: "bg-blue-50 border-blue-200 text-blue-700",
  ECONOMY: "bg-emerald-50 border-emerald-200 text-emerald-700",
}

const POSITION_COLORS: Record<string, string> = {
  WINDOW: "border-sky-400 hover:bg-sky-100",
  MIDDLE: "border-gray-300 hover:bg-gray-100",
  AISLE: "border-violet-400 hover:bg-violet-100",
}

export function SeatMap({ flightNumber, aircraftType, classes, selectedSeats, onSeatSelect, onSeatDeselect, passengerCount, activeClass: preSelectedClass }: SeatMapProps) {
  const [activePassenger, setActivePassenger] = useState(0)

  // Initialize with pre-selected class if provided, otherwise first class
  const [selectedClass, setSelectedClass] = useState(() => {
    if (preSelectedClass && classes.some(c => c.class === preSelectedClass)) {
      return preSelectedClass
    }
    return classes[0]?.class || ""
  })

  // Sync with preSelectedClass if it changes
  useEffect(() => {
    if (preSelectedClass && classes.some(c => c.class === preSelectedClass)) {
      setSelectedClass(preSelectedClass)
    }
  }, [preSelectedClass, classes])

  const isClassLocked = !!preSelectedClass
  const currentClass = classes.find(c => c.class === selectedClass)
  const columns = currentClass ? [...new Set(currentClass.seats.map(s => s.column))].sort() : []

  const handleSeatClick = (seat: SeatData) => {
    if (seat.isBooked || seat.isBlocked) return

    // Check if this seat is already selected by the current passenger
    if (selectedSeats[activePassenger]?.id === seat.id) {
      onSeatDeselect(activePassenger)
      return
    }

    // Check if this seat is selected by another passenger
    const takenBy = Object.entries(selectedSeats).find(([, s]) => s?.id === seat.id)
    if (takenBy) return // Already taken by another passenger

    onSeatSelect(activePassenger, seat)
  }

  const getPassengerLabel = (index: number) => {
    const seat = selectedSeats[index]
    return seat ? `P${index + 1}: ${seat.seatNumber}` : `Passenger ${index + 1}`
  }

  return (
    <div className="space-y-6">
      {/* Flight info header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Select your seats</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {flightNumber} · {aircraftType}
          </p>
        </div>
        <SeatLegend />
      </div>

      {/* Passenger selector */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-muted/50 border border-border/60">
        <span className="text-xs font-semibold text-muted-foreground px-2 shrink-0">Selecting for:</span>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: passengerCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setActivePassenger(i)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all",
                activePassenger === i
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : selectedSeats[i]
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-background text-muted-foreground border border-border/60 hover:border-border",
              )}
            >
              {getPassengerLabel(i)}
            </button>
          ))}
        </div>
      </div>

      {/* Class tabs — hidden when class is pre-selected (locked) */}
      {!isClassLocked && classes.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {classes.map(cls => {
            const Icon = CLASS_ICONS[cls.class] || Ticket
            const availableCount = cls.seats.filter(s => !s.isBooked && !s.isBlocked).length
            return (
              <button
                key={cls.class}
                onClick={() => setSelectedClass(cls.class)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border",
                  selectedClass === cls.class ? `${CLASS_COLORS[cls.class]} shadow-sm` : "border-border/60 bg-card text-muted-foreground hover:border-border",
                )}
              >
                <Icon className="h-4 w-4" />
                {CLASS_LABELS[cls.class]}
                <span className="text-xs text-muted-foreground">({availableCount} available)</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Locked class badge — shown when class is pre-selected */}
      {isClassLocked && currentClass && (
        <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border w-fit", CLASS_BADGE_COLORS[selectedClass] || "bg-muted/50 border-border")}>
          <span className="text-sm font-medium">{CLASS_LABELS[selectedClass] || selectedClass}</span>
          <span className="h-3 w-px bg-border" />
          <span className="text-xs text-muted-foreground">{currentClass.seats.filter(s => !s.isBooked && !s.isBlocked).length} seats available</span>
        </div>
      )}

      {/* Seat map */}
      {currentClass && (
        <div className="rounded-2xl border border-border/60 bg-card p-6 overflow-x-auto">
          {/* Aircraft nose */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-3 bg-muted rounded-t-full" />
          </div>

          {/* Column headers */}
          <div className="flex justify-center gap-1 mb-2">
            {columns.map(col => (
              <div key={col} className="w-10 h-6 flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                {col}
              </div>
            ))}
            {/* Gap for aisle */}
            {columns.length > 4 && <div className="w-6" />}
            {/* Repeat column headers for right side */}
            {columns.length > 4 &&
              columns.slice(Math.ceil(columns.length / 2)).map(col => (
                <div key={`right-${col}`} className="w-10 h-6 flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
                  {col}
                </div>
              ))}
          </div>

          {/* Seat rows */}
          <div className="space-y-1.5">
            {currentClass.rows.map(row => {
              const rowSeats = currentClass.seats.filter(s => s.row === row)
              const halfLength = Math.ceil(rowSeats.length / 2)
              const leftSeats = rowSeats.slice(0, halfLength)
              const rightSeats = rowSeats.slice(halfLength)

              return (
                <div key={row} className="flex items-center justify-center gap-1">
                  {/* Row number (left) */}
                  <span className="w-7 text-center text-[10px] font-bold text-muted-foreground shrink-0">{row}</span>

                  {/* Left seats */}
                  <div className="flex gap-1">
                    {leftSeats.map(seat => (
                      <SeatButton
                        key={seat.id}
                        seat={seat}
                        isActive={selectedSeats[activePassenger]?.id === seat.id}
                        isTakenByOther={Object.entries(selectedSeats).some(([idx, s]) => Number(idx) !== activePassenger && s?.id === seat.id)}
                        onClick={() => handleSeatClick(seat)}
                      />
                    ))}
                  </div>

                  {/* Aisle */}
                  {rightSeats.length > 0 && <div className="w-6 shrink-0" />}

                  {/* Right seats */}
                  {rightSeats.length > 0 && (
                    <div className="flex gap-1">
                      {rightSeats.map(seat => (
                        <SeatButton
                          key={seat.id}
                          seat={seat}
                          isActive={selectedSeats[activePassenger]?.id === seat.id}
                          isTakenByOther={Object.entries(selectedSeats).some(([idx, s]) => Number(idx) !== activePassenger && s?.id === seat.id)}
                          onClick={() => handleSeatClick(seat)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Row number (right) */}
                  <span className="w-7 text-center text-[10px] font-bold text-muted-foreground shrink-0">{row}</span>
                </div>
              )
            })}
          </div>

          {/* Aircraft tail */}
          <div className="flex justify-center mt-6">
            <div className="w-12 h-3 bg-muted rounded-b-full" />
          </div>
        </div>
      )}

      {/* Empty state — no class selected */}
      {!currentClass && classes.length === 0 && (
        <div className="text-center py-12 rounded-2xl border border-border/60 bg-card">
          <Ticket className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="mt-3 text-sm text-muted-foreground">No seat map available for this flight.</p>
        </div>
      )}
    </div>
  )
}

// ─── Individual Seat Button ───
function SeatButton({ seat, isActive, isTakenByOther, onClick }: { seat: SeatData; isActive: boolean; isTakenByOther: boolean; onClick: () => void }) {
  const isDisabled = seat.isBooked || seat.isBlocked || isTakenByOther

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      title={`${seat.seatNumber} - ${seat.position}${seat.isBooked ? " (Booked)" : seat.isBlocked ? " (Blocked)" : isTakenByOther ? " (Selected by another passenger)" : " (Available)"}`}
      className={cn(
        "w-10 h-10 rounded-xl border-2 text-[10px] font-bold transition-all duration-150 relative",
        "flex items-center justify-center",
        // Selected by current passenger
        isActive && "border-primary bg-primary text-primary-foreground shadow-md scale-105 z-10",
        // Taken by another passenger
        isTakenByOther && !isActive && "border-emerald-400 bg-emerald-100 text-emerald-700 cursor-not-allowed",
        // Available — use position-based colors
        !isActive &&
          !isTakenByOther &&
          !seat.isBooked &&
          !seat.isBlocked &&
          (POSITION_COLORS[seat.position] || "border-border bg-background hover:border-primary/50 hover:bg-primary/5 hover:scale-105 cursor-pointer"),
        // Booked
        seat.isBooked && "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50",
        // Blocked
        seat.isBlocked && "border-destructive/20 bg-destructive/5 text-muted-foreground cursor-not-allowed",
      )}
    >
      {seat.seatNumber}
      {/* Position indicator dot */}
      {!seat.isBooked && !seat.isBlocked && (
        <span
          className={cn(
            "absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border border-background",
            seat.position === "WINDOW" && "bg-sky-400",
            seat.position === "MIDDLE" && "bg-gray-400",
            seat.position === "AISLE" && "bg-violet-400",
            isActive && "bg-white",
          )}
        />
      )}
    </button>
  )
}
