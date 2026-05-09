import { cn } from "@/lib/utils"
import { Check, Coffee, X } from "lucide-react"
import { Amenity } from "./types"

export function FlightDetailsClassAmenities({ amenities }: { amenities: Amenity[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Coffee className="h-4 w-4 text-accent" />
        What&apos;s included
      </h4>
      <div className="mt-3 grid gap-2">
        {amenities.map(amenity => (
          <div
            key={amenity.label}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-xl text-sm transition-colors",
              amenity.included ? "bg-card/50 border border-border/60" : "bg-muted/30 border border-border/40 opacity-50",
            )}
          >
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", amenity.included ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>
              <amenity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-xs">{amenity.label}</p>
              {amenity.note && <p className="text-[10px] text-muted-foreground mt-0.5">{amenity.note}</p>}
            </div>
            {amenity.included ? <Check className="h-4 w-4 text-emerald-500 shrink-0" /> : <X className="h-4 w-4 text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>
    </div>
  )
}
