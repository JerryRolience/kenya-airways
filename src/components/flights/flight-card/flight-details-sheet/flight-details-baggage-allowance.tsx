import { Luggage } from "lucide-react"
import { BaggageAllowance } from "./types"

export function FlightDetailsBaggageAllowance({ baggage }: { baggage: BaggageAllowance[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Luggage className="h-4 w-4 text-accent" />
        Baggage Allowance
      </h4>
      <div className="mt-3 grid gap-2">
        {baggage.map(bag => (
          <div key={bag.type} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <bag.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">{bag.type}</p>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-muted-foreground">Cabin</p>
                  <p className="text-xs font-medium text-foreground">{bag.cabin}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">Checked</p>
                  <p className="text-xs font-medium text-foreground">{bag.checked}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
