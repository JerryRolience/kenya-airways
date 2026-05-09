"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { FlightSearchResponse } from "@/types/flights"
import { SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlightFiltersProps {
  filters: FlightSearchResponse["filters"]
  directOnly: boolean
  onDirectOnlyChange: (v: boolean) => void
  selectedAirlines: string[]
  onAirlinesChange: (v: string[]) => void
  priceRange: [number, number]
  onPriceRangeChange: (v: [number, number]) => void
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">{title}</h4>
      {children}
    </div>
  )
}

export function FlightFilters({ filters, directOnly, onDirectOnlyChange, selectedAirlines, onAirlinesChange, priceRange, onPriceRangeChange }: FlightFiltersProps) {
  const hasActiveFilters = directOnly || selectedAirlines.length > 0
  const toggle = (airline: string) => onAirlinesChange(selectedAirlines.includes(airline) ? selectedAirlines.filter(a => a !== airline) : [...selectedAirlines, airline])

  const reset = () => {
    onDirectOnlyChange(false)
    onAirlinesChange([])
    onPriceRangeChange([filters.priceRange.min, filters.priceRange.max])
  }

  return (
    <div className="sticky top-20 rounded-2xl border border-border/60 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Filters</span>
        </div>
        {hasActiveFilters && (
          <button onClick={reset} className="flex items-center gap-1 text-[11px] font-medium text-accent hover:text-accent/80 transition-colors">
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="px-5 py-5 space-y-6">
        {/* Stops */}
        <FilterSection title="Stops">
          <label
            className={cn(
              "flex items-center gap-3 cursor-pointer rounded-xl border px-3 py-2.5 transition-all",
              directOnly ? "border-primary/30 bg-primary/5" : "border-border/50 hover:border-border hover:bg-muted/30",
            )}
          >
            <Checkbox checked={directOnly} onCheckedChange={c => onDirectOnlyChange(c as boolean)} className="rounded" />
            <div>
              <p className="text-sm font-medium text-foreground">Direct only</p>
              <p className="text-[11px] text-muted-foreground">No stopovers</p>
            </div>
          </label>
        </FilterSection>

        {/* Airlines */}
        {filters.airlines.length > 0 && (
          <FilterSection title="Airlines">
            <div className="space-y-1.5">
              {filters.airlines.map(airline => {
                const active = selectedAirlines.includes(airline)
                return (
                  <label
                    key={airline}
                    className={cn(
                      "flex items-center gap-3 cursor-pointer rounded-xl border px-3 py-2.5 transition-all",
                      active ? "border-primary/30 bg-primary/5" : "border-border/50 hover:border-border hover:bg-muted/30",
                    )}
                  >
                    <Checkbox checked={active} onCheckedChange={() => toggle(airline)} className="rounded" />
                    <span className="text-sm font-medium text-foreground">{airline} Airways</span>
                  </label>
                )
              })}
            </div>
          </FilterSection>
        )}

        {/* Price */}
        {filters.priceRange.max > 0 && (
          <FilterSection title="Price per person">
            <div className="space-y-4 pt-1">
              <Slider min={filters.priceRange.min} max={filters.priceRange.max} step={1000} value={priceRange} onValueChange={v => onPriceRangeChange(v as [number, number])} />
              <div className="flex items-center justify-between">
                <div className="rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1.5">
                  <p className="text-[10px] text-muted-foreground">Min</p>
                  <p className="text-xs font-semibold text-foreground">KES {priceRange[0].toLocaleString()}</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 px-2.5 py-1.5 text-right">
                  <p className="text-[10px] text-muted-foreground">Max</p>
                  <p className="text-xs font-semibold text-foreground">KES {priceRange[1].toLocaleString()}</p>
                </div>
              </div>
            </div>
          </FilterSection>
        )}
      </div>
    </div>
  )
}
