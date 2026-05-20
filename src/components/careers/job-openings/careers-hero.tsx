import { NumberTicker } from "@/components/ui/number-ticker"
import { Sparkles } from "lucide-react"

export function CareersHero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary/95 to-primary/90">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-20 md:py-28 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 mb-6">
          <Sparkles className="h-4 w-4 text-accent" />
          Join the Pride of Africa
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">Careers at Kenya Airways</h1>
        <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">Help us connect Africa to the world and the world to Africa. Explore opportunities across our global operations.</p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: 4000, label: "Employees", startValue: 3500, valueDominion: "K+" },
            { value: 42, label: "Destinations" },
            { value: 15, label: "Departments" },
          ].map(s => (
            <div key={s.label} className="flex items-center flex-col  md:text-left rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <div className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                {typeof s.value === "number" ? (
                  <div className="flex justify-center">
                    <NumberTicker value={s.value} startValue={s.startValue ? s.startValue : 0} className="text-accent text-xl" />
                    {s.valueDominion && <span className="text-sm mt-2 text-accent">{s.valueDominion}</span>}
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
