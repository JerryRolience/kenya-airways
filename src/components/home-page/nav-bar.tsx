import { Plane, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

const links = [
  { label: "Flights", to: "/" },
  { label: "Manage Booking", to: "/" },
  { label: "Help", to: "/" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <nav className="glass shadow-elegant flex items-center justify-between rounded-2xl px-4 py-2.5 md:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-elegant transition-transform group-hover:-rotate-6">
              <Plane className="h-4.5 w-4.5" strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Skyline<span className="text-accent">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="hidden bg-primary text-primary-foreground hover:bg-primary/90 md:inline-flex rounded-xl"
            >
              Book Now
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="font-display">Menu</SheetTitle>
                <div className="mt-6 flex flex-col gap-1">
                  {links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.to}
                      className="rounded-lg px-3 py-3 text-base font-medium hover:bg-secondary"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Button className="mt-4 rounded-xl">Book Now</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
