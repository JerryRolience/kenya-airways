"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, X, Armchair, Ruler } from "lucide-react"
import Link from "next/link"
import { CABIN_DATA } from "@/constants/help-data"
import { cn } from "@/lib/utils"

export function CabinsHelp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-linear-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/help" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors mb-6 mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Cabin class guide</h1>
          <p className="mt-3 text-white/70 max-w-2xl">Compare our three travel classes and find the perfect experience for your journey.</p>
        </div>
      </section>

      {/* Cabin Cards */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {CABIN_DATA.map(cabin => (
              <Card key={cabin.class} className="relative overflow-hidden border-border/60 bg-card">
                {/* Gradient top */}
                <div className="h-2 bg-linear-to-r" />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="font-display text-xl font-bold text-foreground">{cabin.name}</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">{cabin.tagline}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize text-xs",
                        cabin.class === "EXECUTIVE" && "border-amber-200 text-amber-700 bg-amber-50",
                        cabin.class === "MIDDLE" && "border-blue-200 text-blue-700 bg-blue-50",
                        cabin.class === "ECONOMY" && "border-emerald-200 text-emerald-700 bg-emerald-50",
                      )}
                    >
                      Class {cabin.class === "EXECUTIVE" ? "A" : cabin.class === "MIDDLE" ? "B" : "C"}
                    </Badge>
                  </div>

                  {/* Price */}
                  <p className="text-2xl font-bold text-foreground font-display">{cabin.priceFrom}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">per person</p>

                  {/* Description */}
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{cabin.description}</p>

                  {/* Seat Specs */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Armchair className="h-3.5 w-3.5 text-accent" />
                      <span className="font-medium text-foreground">{cabin.seatType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Ruler className="h-3.5 w-3.5 text-accent" />
                      <span>
                        Pitch: {cabin.seatPitch} • Width: {cabin.seatWidth}
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-5 space-y-1.5">
                    {cabin.amenities.slice(0, 6).map(amenity => (
                      <div key={amenity.label} className="flex items-center gap-2 text-xs">
                        {amenity.included ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <X className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />}
                        <span className={cn(amenity.included ? "text-muted-foreground" : "text-muted-foreground/40 line-through")}>{amenity.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Baggage */}
                  <div className="mt-5 pt-5 border-t border-border/60">
                    <p className="text-xs font-semibold text-foreground">Baggage</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Cabin</p>
                        <p className="font-medium text-foreground">{cabin.baggage.cabin}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Checked</p>
                        <p className="font-medium text-foreground">{cabin.baggage.checked}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Fare Rules Comparison */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold text-foreground text-center">Fare rules comparison</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Executive</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Middle</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground">Economy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Cancellation", exec: "Full refund", mid: "KES 5,000 fee", eco: "Travel credit" },
                    { label: "Date changes", exec: "Free anytime", mid: "Free >24h", eco: "KES 3,000" },
                    { label: "Name changes", exec: "Permitted", mid: "Fee applies", eco: "Not permitted" },
                    { label: "SkyMiles earning", exec: "200%", mid: "150%", eco: "100%" },
                    { label: "Standby", exec: "Free", mid: "Small fee", eco: "Not available" },
                    { label: "Seat selection", exec: "Free", mid: "Free", eco: "From KES 1,000" },
                  ].map(row => (
                    <tr key={row.label} className="border-b border-border/60">
                      <td className="py-3 px-4 font-medium text-foreground">{row.label}</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">{row.exec}</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">{row.mid}</td>
                      <td className="py-3 px-4 text-center text-muted-foreground">{row.eco}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
