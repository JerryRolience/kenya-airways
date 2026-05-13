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
            { value: "4,000+", label: "Employees" },
            { value: "42", label: "Destinations" },
            { value: "15+", label: "Departments" },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <p className="text-xl font-bold text-white font-display">{stat.value}</p>
              <p className="text-xs text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
