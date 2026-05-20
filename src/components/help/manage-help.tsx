"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lightbulb, Ticket } from "lucide-react"
import Link from "next/link"
import { MANAGE_TOPICS } from "@/constants/help-data"

export function ManageHelp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-linear-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/help" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors mb-6 mt-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Manage your booking</h1>
          <p className="mt-3 text-white/70 max-w-2xl">Change dates, add baggage, update details, or cancel your Kenya Airways booking online.</p>
        </div>
      </section>

      {/* Topics */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-6">
            {MANAGE_TOPICS.map(topic => (
              <Card key={topic.id} id={topic.id} className="border-border/60 bg-card overflow-hidden scroll-mt-24">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <topic.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h2 className="font-display text-lg font-semibold text-foreground">{topic.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>

                      {/* Steps */}
                      <div className="mt-4 space-y-2">
                        {topic.steps.map((step, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground mt-0.5">{i + 1}</span>
                            <p className="text-sm text-muted-foreground">{step}</p>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      {topic.notes.length > 0 && (
                        <div className="mt-5 flex items-start gap-2 rounded-xl bg-accent/5 border border-accent/20 p-4">
                          <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <ul className="space-y-1">
                            {topic.notes.map((note, i) => (
                              <li key={i} className="text-xs text-muted-foreground">
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link href="/bookings">
              <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                <Ticket className="mr-2 h-4 w-4" />
                Manage your booking now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
