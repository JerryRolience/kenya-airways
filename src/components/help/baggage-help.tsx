"use client"

import { Card } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { BAGGAGE_POLICIES, CABIN_DATA } from "@/constants/help-data"
import { cn } from "@/lib/utils"

export function BaggageHelp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-linear-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/help" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors mb-6 mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Baggage policy</h1>
          <p className="mt-3 text-white/70 max-w-2xl">Everything you need to know about what you can bring on your Kenya Airways flight.</p>
        </div>
      </section>

      {/* Quick Reference Card */}
      <section className="relative -mt-8 mx-auto max-w-6xl px-4 pb-8">
        <Card className="border-border/60 bg-card p-6 shadow-elegant">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">Quick reference by class</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {CABIN_DATA.map(cabin => (
              <div
                key={cabin.class}
                className={cn(
                  "rounded-xl border p-4",
                  cabin.class === "EXECUTIVE" && "border-amber-600",
                  cabin.class === "MIDDLE" && "border-blue-600",
                  cabin.class === "ECONOMY" && "border-emerald-600 ",
                )}
              >
                <h3 className="text-sm font-semibold text-foreground">{cabin.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Cabin</p>
                    <p className="font-medium text-foreground">{cabin.baggage.cabin}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Checked</p>
                    <p className="font-medium text-foreground">{cabin.baggage.checked}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Detailed Policies */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-8">
            {BAGGAGE_POLICIES.map(policy => (
              <div key={policy.category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <policy.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">{policy.category}</h2>
                    <p className="text-xs text-muted-foreground">{policy.description}</p>
                  </div>
                </div>

                <Card className="border-border/60 bg-card overflow-hidden">
                  <div className="divide-y divide-border/60">
                    {policy.items.map(item => (
                      <div key={item.title} className="flex flex-col sm:flex-row sm:items-center gap-2 px-5 py-4">
                        <p className="text-sm font-medium text-foreground sm:w-48 shrink-0">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.details}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="mt-8 flex items-start gap-3 rounded-xl border border-amber-600 p-5">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Important notice</p>
              <p className="mt-1 text-xs text-amber-700">
                Baggage policies may vary for codeshare flights operated by partner airlines. Always check your e-ticket for specific baggage information for your booking. Excess baggage fees at the
                airport are higher than online pre-purchase rates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
