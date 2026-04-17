"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeftRight,
  CalendarIcon,
  Loader2,
  MapPin,
  Plane,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const cities = [
  "Nairobi (NBO)",
  "London (LHR)",
  "Dubai (DXB)",
  "New York (JFK)",
  "Paris (CDG)",
  "Cape Town (CPT)",
  "Bangkok (BKK)",
  "Lagos (LOS)",
  "Amsterdam (AMS)",
];

export function BookingCard() {
  const [from, setFrom] = useState("Nairobi (NBO)");
  const [to, setTo] = useState("London (LHR)");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [cabin, setCabin] = useState("executive");
  const [pax, setPax] = useState("1");
  const [loading, setLoading] = useState(false);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const search = () => {
    if (from === to) {
      toast.error("Origin and destination must differ");
      return;
    }
    if (!date) {
      toast.error("Please choose a departure date");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Searching ${from.split(" ")[0]} → ${to.split(" ")[0]}`, {
        description: `${format(date, "PPP")} · ${pax} pax · ${cabin}`,
      });
    }, 1100);
  };

  return (
    <Card className="shadow-elegant relative overflow-hidden border-border/60 bg-card/95 p-5 backdrop-blur-xl md:p-7">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative grid gap-4 md:grid-cols-12">
        {/* From / To */}
        <div className="md:col-span-5">
          <Field label="From" icon={<MapPin className="h-3.5 w-3.5" />}>
            <CitySelect value={from} onChange={setFrom} />
          </Field>
        </div>

        <div className="hidden items-end justify-center pb-1 md:col-span-1 md:flex">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={swap}
            className="rounded-full border-border bg-background shadow-elegant transition-transform hover:rotate-180"
            aria-label="Swap origin and destination"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="md:col-span-6">
          <Field label="To" icon={<Plane className="h-3.5 w-3.5" />}>
            <CitySelect value={to} onChange={setTo} />
          </Field>
        </div>

        {/* Date */}
        <div className="md:col-span-4">
          <Field
            label="Departure"
            icon={<CalendarIcon className="h-3.5 w-3.5" />}
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-11 w-full justify-start rounded-xl border border-input bg-background px-3 text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  {date ? format(date, "EEE, MMM d") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(d) =>
                    d < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </Field>
        </div>

        {/* Class */}
        <div className="md:col-span-4">
          <Field label="Class">
            <Select value={cabin} onValueChange={setCabin}>
              <SelectTrigger className="h-11 rounded-xl bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="middle">Middle</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Passengers */}
        <div className="md:col-span-4">
          <Field label="Passengers" icon={<Users className="h-3.5 w-3.5" />}>
            <Select value={pax} onValueChange={setPax}>
              <SelectTrigger className="h-11 rounded-xl bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? "passenger" : "passengers"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Mobile swap */}
        <div className="md:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={swap}
            className="w-full rounded-xl"
          >
            <ArrowLeftRight className="mr-2 h-4 w-4" /> Swap cities
          </Button>
        </div>

        <div className="md:col-span-12">
          <Button
            onClick={search}
            disabled={loading}
            className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Search Flights
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </Label>
      {children}
    </div>
  );
}

function CitySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 rounded-xl bg-background text-left">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {cities.map((c) => (
          <SelectItem key={c} value={c}>
            {c}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Unused import shim to satisfy the linter for Input (kept for extensibility)
export const _BookingInput = Input;
