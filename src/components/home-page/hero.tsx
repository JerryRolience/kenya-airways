import { Plane } from "lucide-react";
import { BookingCard } from "./booking-card";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Background image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/hero-aviation.jpg"
          alt="Aerial view of an airliner above African savanna at sunset"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/20 via-background/35 to-background" />
      </div>
      <div className="absolute inset-0 -z-10 bg-mesh" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 border border-border/60 bg-white/40  rounded-full px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[12px] font-medium">
              Live seat availability • Instant booking
            </span>
            <Plane className="w-3 h-3 text-accent -rotate-45" />
          </div>
          <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Book flights <span className="text-accent">seamlessly</span>
            <br className="hidden md:block" /> across the world.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base  text-gray-600 font-medium md:text-lg">
            Premium fares, transparent pricing, and a booking flow built for the
            way you actually travel.
          </p>
        </div>

        <div
          className="mx-auto mt-10 max-w-5xl animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
          <BookingCard />
        </div>

        <div
          className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <Trust label="Best Price Guarantee" />
          <Trust label="24/7 Support" />
          <Trust label="Flexible Cancellation" />
          <Trust label="Earn SkyMiles" />
        </div>
      </div>
    </section>
  );
}

function Trust({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      <span>{label}</span>
    </div>
  );
}
