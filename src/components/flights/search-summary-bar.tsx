"use client"

import { FlightSearchParams } from "@/types/flights"
import { format } from "date-fns"
import { ArrowRight, Plane, Users, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SearchSummaryBarProps {
  searchParams: FlightSearchParams
  totalResults: number
}

const CLASS_STYLES = {
  EXECUTIVE: "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20",
  MIDDLE: "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20",
  ECONOMY: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20",
}

const CLASS_LABELS = {
  EXECUTIVE: "Executive",
  MIDDLE: "Middle",
  ECONOMY: "Economy",
}

export function SearchSummaryBar({ searchParams, totalResults }: SearchSummaryBarProps) {
  return (
    <div className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: route + meta */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Route */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Plane className="h-3.5 w-3.5 text-primary -rotate-45" strokeWidth={2.5} />
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                <span>{searchParams.from}</span>
                <ArrowRight className="h-3 w-3 text-muted-foreground/50 shrink-0" />
                <span>{searchParams.to}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* Date(s) */}
            <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>{format(searchParams.date, "EEE d MMM")}</span>
              {searchParams.returnDate && (
                <>
                  <ChevronRight className="h-3 w-3 opacity-40" />
                  <span>{format(searchParams.returnDate, "EEE d MMM")}</span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-border hidden md:block" />

            {/* Pax */}
            <div className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{searchParams.passengers} pax</span>
            </div>

            {/* Class badge */}
            <span className={cn("hidden sm:inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full", CLASS_STYLES[searchParams.class])}>{CLASS_LABELS[searchParams.class]}</span>
          </div>

          {/* Right: results count + modify */}
          <div className="flex items-center gap-3 shrink-0">
            {totalResults > 0 && (
              <span className="hidden sm:block text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{totalResults}</span> flight{totalResults !== 1 ? "s" : ""}
              </span>
            )}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground border border-border/60 hover:border-border rounded-xl px-3 py-2 transition-all duration-200 bg-background hover:bg-muted/50"
            >
              Modify search
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
