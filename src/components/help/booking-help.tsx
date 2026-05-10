"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Armchair, ArrowLeft, CheckCircle2, CreditCard, PlaneTakeoff, Search, Ticket, Users } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    id: "search-flights",
    icon: Search,
    title: "1. Search for flights",
    description: "Enter your departure city, destination, travel dates, and number of passengers. Select your preferred cabin class — Executive, Middle, or Economy.",
    tips: ["Book at least 3 weeks in advance for the best fares", "Use the 'Flexible dates' option to compare prices across a week", "Sign in to earn SkyMiles on your booking"],
  },
  {
    id: "seat-selection",
    icon: Armchair,
    title: "2. Select your flight & seat",
    description:
      "Browse available flights sorted by price, duration, or departure time. Click 'View details' to see amenities, baggage allowance, and fare rules. Then pick your preferred seat from the interactive seat map.",
    tips: ["Executive class: Lie-flat seats with direct aisle access", "Window seats (A/F): Best views during daytime flights", "Aisle seats: Easier access to lavatories and overhead bins"],
  },
  {
    id: "passenger-details",
    icon: Users,
    title: "3. Enter passenger details",
    description:
      "Fill in each passenger's full name (as it appears on their passport), date of birth, nationality, and passport number. You can save passengers to your profile for faster future bookings.",
    tips: ["Names must match your passport exactly", "Add frequent flyer numbers to earn miles", "Special meal requests can be added during this step"],
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "4. Pay securely",
    description: "Choose your payment method — M-Pesa, Visa, Mastercard, American Express, or bank transfer. All payments are processed securely with encryption.",
    tips: ["M-Pesa: Instant confirmation for Kenyan customers", "Cards: 3D Secure authentication for added safety", "You'll receive an SMS confirmation after payment"],
  },
  {
    id: "ticket",
    icon: Ticket,
    title: "5. Get your ticket",
    description:
      "Once payment is confirmed, your e-ticket is generated instantly. Download it, save it to your mobile wallet, or print it. Your boarding pass will be available 24 hours before departure.",
    tips: ["Mobile boarding passes accepted at all airports", "Check-in online 24 hours before your flight", "Add your booking to Google Wallet or Apple Wallet"],
  },
]

export function BookingHelp() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-linear-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/help" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">How to book a flight</h1>
          <p className="mt-3 text-white/70 max-w-2xl">Follow these simple steps to book your Kenya Airways flight online. The whole process takes less than 5 minutes.</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="space-y-6">
            {steps.map(step => (
              <Card id={step.id} key={step.title} className="border-border/60 bg-card overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-5 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    <ul className="mt-4 space-y-2">
                      {step.tips.map(tip => (
                        <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Link href="/#booking-card">
              <Button className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                <PlaneTakeoff className="mr-2 h-4 w-4" />
                Book a flight now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
