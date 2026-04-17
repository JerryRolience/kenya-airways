import { Check, Crown, Sofa, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const cabins = [
  {
    icon: Crown,
    name: "Executive",
    tagline: "Lie-flat suites & priority everything",
    price: "from $1,890",
    perks: [
      "Lie-flat seats",
      "Lounge access",
      "Chef-curated dining",
      "Priority boarding",
    ],
    highlight: true,
  },
  {
    icon: Sofa,
    name: "Middle",
    tagline: "Extra space, extra comfort",
    price: "from $890",
    perks: [
      "Premium recliner",
      "Priority check-in",
      "Two free bags",
      "Enhanced meal",
    ],
    highlight: false,
  },
  {
    icon: Ticket,
    name: "Low",
    tagline: "Smart fares without compromise",
    price: "from $380",
    perks: [
      "Comfortable seat",
      "One free bag",
      "Inflight snack",
      "Mobile boarding",
    ],
    highlight: false,
  },
];

export function FlightExperience() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Cabins
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Three ways to fly. One uncompromising standard.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether you are unwinding in a private suite or grabbing a quick
              hop across the continent, every cabin is designed around comfort,
              clarity, and care.
            </p>
            <Button className="mt-6 rounded-xl" variant="outline">
              Compare cabins
            </Button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {cabins.map((c) => (
              <Card
                key={c.name}
                className={
                  c.highlight
                    ? "relative overflow-hidden border-transparent bg-primary p-6 text-primary-foreground shadow-elegant"
                    : "border-border/60 bg-card p-6"
                }
              >
                {c.highlight && (
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
                )}
                <div
                  className={
                    c.highlight
                      ? "flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"
                      : "flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-foreground"
                  }
                >
                  <c.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display mt-5 text-xl font-semibold">
                  {c.name}
                </h3>
                <p
                  className={
                    c.highlight
                      ? "mt-1 text-sm text-primary-foreground/75"
                      : "mt-1 text-sm text-muted-foreground"
                  }
                >
                  {c.tagline}
                </p>
                <div className="font-display mt-4 text-2xl font-semibold">
                  {c.price}
                </div>
                <ul className="mt-5 space-y-2 text-sm">
                  {c.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <Check
                        className={
                          c.highlight
                            ? "h-4 w-4 text-accent"
                            : "h-4 w-4 text-primary"
                        }
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
