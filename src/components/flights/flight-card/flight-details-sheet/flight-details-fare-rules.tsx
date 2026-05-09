import { Info } from "lucide-react"

export function FlightDetailsFareRules({ rules }: { rules: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
        <Info className="h-4 w-4 text-accent" />
        Fare Rules & Flexibility
      </h4>
      <ul className="mt-3 space-y-2">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
            {rule}
          </li>
        ))}
      </ul>
    </div>
  )
}
