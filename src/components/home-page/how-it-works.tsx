import { Search, CreditCard, PlaneTakeoff } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Flights",
    desc: "Tell us where and when. We surface the best fares across all cabins instantly.",
  },
  {
    icon: CreditCard,
    title: "Book Your Seat",
    desc: "Pick your seat, add extras, and pay securely — no hidden fees, ever.",
  },
  {
    icon: PlaneTakeoff,
    title: "Get Your Ticket",
    desc: "Mobile boarding pass delivered to your inbox in seconds. You are ready to fly.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            How it works
          </span>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
            Three steps. You are flying.
          </h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative">
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl font-semibold text-accent/30">
                  0{i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="font-display mt-5 text-xl font-semibold">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
