import { ShieldCheck, Wallet, Headphones, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Best Price Guarantee",
    desc: "Find a lower fare elsewhere within 24h and we refund the difference — no questions.",
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    desc: "Tickets issued in seconds with mobile boarding passes synced to your wallet.",
  },
  {
    icon: ShieldCheck,
    title: "Flexible Changes",
    desc: "Modify dates or cancel up to 24 hours before takeoff on most fares.",
  },
  {
    icon: Headphones,
    title: "Human Support 24/7",
    desc: "Real travel specialists, available across chat, email, and phone — globally.",
  },
];

export function Features() {
  return (
    <section className="border-y border-border/60 bg-secondary/40 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Why Skyline
          </span>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
            Built for travelers who expect more
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card
              key={f.title}
              className="group h-full border-border/60 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
