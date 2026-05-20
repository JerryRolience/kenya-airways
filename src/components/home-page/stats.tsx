import { NumberTicker } from "@/components/ui/number-ticker"

const stats = [
  { value: 120, label: "Bookings completed", valueDominion: "K+" },
  { value: 98.7, label: "On-time reliability" },
  { value: 240, label: "Destinations served" },
  { value: "24/7", label: "Hours of support" },
]

export function Stats() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="flex items-center flex-col  md:text-left">
              <div className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                {typeof s.value === "number" ? (
                  <div className="flex justify-center">
                    <NumberTicker value={s.value} className="text-accent" />
                    {s.valueDominion && <span className="text-xl mt-4">{s.valueDominion}</span>}
                  </div>
                ) : (
                  <p className="text-accent">{s.value}</p>
                )}
              </div>
              <div className="mt-2 text-sm text-primary-foreground/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
