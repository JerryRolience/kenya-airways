"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Menu, Plane } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../global/theme/theme-toggle";

const links = [
  { label: "Flights", href: "/flights" },
  { label: "Manage Booking", href: "/bookings" },
  { label: "Help", href: "/help" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <nav
          className={cn(
            "flex items-center justify-between px-4 py-2.5 md:px-6 rounded-2xl",
            scrolled
              ? "glass shadow-elegant flex items-center justify-between"
              : "bg-black/10 backdrop-blur-sm",
          )}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elegant transition-transform group-hover:-rotate-6">
              <Plane className="h-4 w-4 -rotate-45" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Kenya <span className="text-accent">Airways</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Link href="/sign-in">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:inline-flex text-sm hover:cursor-pointer"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/book">
              <Button
                size="sm"
                className="hidden bg-accent text-accent-foreground hover:bg-accent/90 md:inline-flex rounded-xl hover:cursor-pointer"
              >
                Book Now
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="font-display">Kenya Airways</SheetTitle>
                <div className="mt-6 flex flex-col gap-1">
                  {links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary hover:text-accent hover:cursor-pointer"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link href="/sign-in">
                    <Button
                      variant="outline"
                      className="mt-3 w-full rounded-xl hover:cursor-pointer"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/book">
                    <Button className="mt-2 w-full rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 hover:cursor-pointer">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
