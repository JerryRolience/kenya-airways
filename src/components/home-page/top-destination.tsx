import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const destinations = [
  {
    city: "London",
    from: "Nairobi",
    price: 612,
    img: "/dest-london.jpg",
    tag: "Direct",
  },
  {
    city: "Dubai",
    from: "Nairobi",
    price: 458,
    img: "/dest-dubai.jpg",
    tag: "Bestseller",
  },
  {
    city: "New York",
    from: "Nairobi",
    price: 890,
    img: "/dest-new-york.jpg",
    tag: "Direct",
  },
  {
    city: "Paris",
    from: "Nairobi",
    price: 705,
    img: "/dest-paris.jpg",
    tag: "Romantic",
  },
  {
    city: "Cape Town",
    from: "Nairobi",
    price: 380,
    img: "/dest-capetown.jpg",
    tag: "Scenic",
  },
  {
    city: "Bangkok",
    from: "Nairobi",
    price: 640,
    img: "/dest-bangkok.jpg",
    tag: "Cultural",
  },
];

export function TopDestinations() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Discover
            </span>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              Top destinations this season
            </h2>
            <p className="mt-3 text-muted-foreground">
              Hand-picked routes our travelers love right now — with the best
              fares we have seen this quarter.
            </p>
          </div>
          <button className="hidden items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-accent md:inline-flex">
            View all destinations
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile horizontal scroll, desktop grid */}
        <div className="mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <DestinationCard key={d.city} {...d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationCard({
  city,
  from,
  price,
  img,
  tag,
  index,
}: {
  city: string;
  from: string;
  price: number;
  img: string;
  tag: string;
  index: number;
}) {
  return (
    <Card
      className="group relative h-95 min-w-70 shrink-0 cursor-pointer snap-start overflow-hidden border-border/60 p-0 shadow-elegant transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-accent md:min-w-0"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Image
        src={img}
        alt={`${city} skyline`}
        width={800}
        height={1000}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/35 to-transparent" />

      <div className="absolute left-4 top-4">
        <span className="rounded-full bg-card/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
          {tag}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="text-xs/none font-medium opacity-80">{from} →</div>
            <div className="font-display mt-1 text-2xl font-semibold">
              {city}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider opacity-70">
              From
            </div>
            <div className="font-display text-2xl font-semibold text-accent">
              ${price}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-xs">
          <span className="opacity-80">Round trip · economy</span>
          <span className="inline-flex items-center gap-1 font-medium transition-transform group-hover:translate-x-0.5">
            Explore <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Card>
  );
}
