"use client"

import { Check, Crown, Sofa, Ticket } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { CABIN_DATA } from "@/constants/help-data"
import { ClassType } from "../../../generated/prisma/enums"

const cabinIcons: Record<ClassType, React.ElementType> = {
  EXECUTIVE: Crown,
  MIDDLE: Sofa,
  ECONOMY: Ticket,
}

export function FlightExperience() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left: Description */}
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Cabins</span>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Three ways to fly. One uncompromising standard.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Whether you are unwinding in a private suite or grabbing a quick hop across the continent, every cabin is designed around comfort, clarity, and care.
            </p>
            <Link href="/help/cabins">
              <Button className="mt-6 rounded-xl" variant="outline">
                Compare cabins
              </Button>
            </Link>
          </div>

          {/* Right: Cabin Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {CABIN_DATA.map(cabin => {
              const Icon = cabinIcons[cabin.class] || Ticket
              const isExecutive = cabin.class === ClassType.EXECUTIVE

              return (
                <Card
                  key={cabin.class}
                  className={
                    isExecutive
                      ? "relative overflow-hidden border-transparent bg-primary p-6 text-primary-foreground shadow-elegant"
                      : "border-border/60 bg-card p-6 hover:shadow-elegant transition-shadow"
                  }
                >
                  {/* Background glow for executive */}
                  {isExecutive && <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />}

                  {/* Icon */}
                  <div
                    className={
                      isExecutive
                        ? "flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"
                        : "flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground"
                    }
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Name + Badge */}
                  <div className="mt-5 flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{cabin.name}</h3>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", isExecutive ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground")}>
                      Class {cabin.class === "EXECUTIVE" ? "A" : cabin.class === "MIDDLE" ? "B" : "C"}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p className={isExecutive ? "mt-1 text-sm text-primary-foreground/75" : "mt-1 text-sm text-muted-foreground"}>{cabin.tagline}</p>

                  {/* Price */}
                  <div className="font-display mt-4 text-xl font-semibold">{cabin.priceFrom}</div>

                  {/* Perks — show first 4 amenities that are included */}
                  <ul className="mt-5 space-y-2 text-sm">
                    {cabin.amenities
                      .filter(a => a.included)
                      .slice(0, 4)
                      .map(amenity => (
                        <li key={amenity.label} className="flex items-center gap-2">
                          <Check className={isExecutive ? "h-4 w-4 text-accent" : "h-4 w-4 text-primary"} />
                          {amenity.label}
                        </li>
                      ))}
                  </ul>

                  {/* Seat info */}
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <p className={isExecutive ? "text-xs text-primary-foreground/60" : "text-xs text-muted-foreground"}>{cabin.seatType}</p>
                    <p className={isExecutive ? "text-xs text-primary-foreground/50 mt-0.5" : "text-xs text-muted-foreground/70 mt-0.5"}>
                      {cabin.seatPitch} • {cabin.seatWidth}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
