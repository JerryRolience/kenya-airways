import Image from "next/image";
import React from "react";
import { Plane } from "lucide-react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 lg:p-8">
      {/* The card — constrained to 3/4 of the page, never full screen */}
      <div className="flex w-full max-w-5xl h-150 overflow-hidden rounded-2xl border border-border shadow-elegant bg-card">
        {/* Left panel — fixed, never scrolls */}
        <div className="relative hidden lg:flex lg:w-[52%] flex-col shrink-0">
          <div className="absolute inset-0">
            <Image
              src="/hero-aviation.jpg"
              alt="Kenya Airways aircraft in flight"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-br from-primary/60 via-primary/30 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-transparent to-transparent" />
          </div>

          {/* Logo top-left */}
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur border border-white/20">
                <Plane
                  className="h-4 w-4 text-white -rotate-45"
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-display text-lg font-semibold text-white tracking-tight">
                Kenya <span className="text-accent">Airways</span>
              </span>
            </div>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10 mt-auto p-8 pb-10">
            <blockquote className="text-white/90">
              <p className="font-display text-2xl font-semibold leading-snug tracking-tight">
                &quot;The world is closer
                <br />
                than you think.&quot;
              </p>
              <footer className="mt-3 text-sm text-white/50">
                Kenya Airways Online — Book, manage, and fly.
              </footer>
            </blockquote>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Instant confirmation", "M-Pesa accepted", "24/7 support"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/*  Right panel — scrollable, left panel stays fixed */}
        <div className="flex flex-1 flex-col overflow-y-auto px-8 py-10 lg:px-12">
          {/* Mobile logo */}
          <div className="mb-7 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Plane
                className="h-3.5 w-3.5 text-white -rotate-45"
                strokeWidth={2.5}
              />
            </div>
            <span className="font-display text-base font-semibold tracking-tight">
              Kenya <span className="text-accent">Airways</span>
            </span>
          </div>

          {/* Centred form — uses margin auto to stay vertically centred when content is short */}
          <div className="my-auto w-full max-w-sm mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
