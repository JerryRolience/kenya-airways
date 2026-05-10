"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"

const faqCategories = [
  {
    category: "Booking & Payment",
    questions: [
      {
        q: "How do I book a flight online?",
        a: "Use the search form on our homepage. Enter your departure city, destination, dates, and number of passengers. Browse available flights, select your preferred one, enter passenger details, and pay securely using M-Pesa, Visa, Mastercard, or American Express.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept M-Pesa, Visa, Mastercard, American Express, and bank transfers. All payments are processed through encrypted, secure channels.",
      },
      {
        q: "Is it safe to pay online?",
        a: "Yes. We use industry-standard SSL encryption and 3D Secure authentication for all card payments. Your payment information is never stored on our servers.",
      },
      {
        q: "Can I hold a reservation without paying?",
        a: "Currently, we require payment to confirm your reservation. However, most fares allow free cancellation within 24 hours of booking.",
      },
      {
        q: "How do I use a promo code?",
        a: "Enter your promo code in the 'Promo Code' field during the payment step. The discount will be applied to your total before you pay.",
      },
    ],
  },
  {
    category: "Baggage",
    questions: [
      {
        q: "What is the baggage allowance for Economy class?",
        a: "Economy passengers can bring 1 cabin bag (7kg max) and check 2 bags (23kg each). Excess baggage fees apply for additional weight.",
      },
      {
        q: "Can I bring a laptop bag in addition to my cabin bag?",
        a: "Yes, in addition to your cabin bag, you may bring one personal item such as a laptop bag, handbag, or small backpack.",
      },
      {
        q: "What items are prohibited in checked baggage?",
        a: "Lithium batteries, e-cigarettes, power banks, and flammable items must be carried in your cabin bag. Firearms and explosives are strictly prohibited.",
      },
    ],
  },
  {
    category: "Changes & Cancellations",
    questions: [
      {
        q: "Can I change my flight date?",
        a: "Yes. Executive class: Free changes. Middle class: Free up to 24h before departure. Economy: KES 3,000 fee + fare difference. Log in to 'Manage Booking' to make changes.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Executive: Fully refundable. Middle: Refundable with KES 5,000 fee. Economy: Non-refundable (travel credit issued). Cancel within 24h of booking for a full refund on all fares.",
      },
      {
        q: "How do I request a refund?",
        a: "Cancel your booking through 'Manage Booking' on our website. Refunds are processed within 7-14 business days to your original payment method.",
      },
    ],
  },
  {
    category: "Check-in & Boarding",
    questions: [
      {
        q: "When does online check-in open?",
        a: "Online check-in opens 24 hours before departure and closes 2 hours before your flight. We recommend checking in as early as possible to secure your preferred seat.",
      },
      {
        q: "What documents do I need to check in?",
        a: "You'll need your booking reference (e.g., KQ-2026-XXXX), passport (international flights), and any required visas. Your e-ticket is not required but helpful.",
      },
      {
        q: "How early should I arrive at the airport?",
        a: "International flights: 3 hours before departure. Domestic flights: 2 hours before departure. Boarding gates close 20 minutes before departure.",
      },
    ],
  },
]

export function FAQ() {
  const [search, setSearch] = useState("")

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return faqCategories
    const q = search.toLowerCase()
    return faqCategories
      .map(cat => ({
        ...cat,
        questions: cat.questions.filter(item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)),
      }))
      .filter(cat => cat.questions.length > 0)
  }, [search])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-linear-to-br from-primary via-primary/95 to-primary/90 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/help" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-3 text-white/70 max-w-2xl">Quick answers to the most common questions from Kenya Airways passengers.</p>

          <div className="mt-6 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search FAQs... (e.g., "cancellation")'
              className="h-12 pl-11 rounded-xl bg-white text-foreground placeholder:text-muted-foreground border-0"
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground/40 mx-auto" />
              <p className="mt-4 text-lg font-medium text-foreground">No FAQs found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredCategories.map(cat => (
                <div key={cat.category}>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-4">{cat.category}</h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {cat.questions.map(item => (
                      <AccordionItem key={item.q} value={item.q} className="border border-border/60 rounded-xl bg-card px-5 data-[state=open]:border-accent/30 data-[state=open]:bg-accent/5">
                        <AccordionTrigger className="text-sm font-medium text-foreground hover:text-accent hover:no-underline py-4">{item.q}</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">{item.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still need help */}
      <section className="py-16 border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="font-display text-xl font-bold text-foreground">Still have questions?</h2>
          <p className="mt-2 text-sm text-muted-foreground">Our support team is available 24/7.</p>
          <Link href="/help#contact" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
            Contact support <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
