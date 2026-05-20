"use client"

import { Features } from "@/components/home-page/features"
import { FlightExperience } from "@/components/home-page/flight-experience"
import { Footer } from "@/components/home-page/footer"
import { HelpCta } from "@/components/home-page/help-cta"
import { Hero } from "@/components/home-page/hero"
import { HowItWorks } from "@/components/home-page/how-it-works"
import { Navbar } from "@/components/home-page/nav-bar"
import { Stats } from "@/components/home-page/stats"
import { TopDestinations } from "@/components/home-page/top-destination"
import { useEffect, useState } from "react"

export default function Home() {
  // State to pass to BookingCard for pre-filling
  const [prefillDestination, setPrefillDestination] = useState<{
    from: string
    to: string
  } | null>(null)

  // Handle cross-page hash scrolling
  useEffect(() => {
    if (window.location.hash === "#booking-card") {
      setTimeout(() => {
        const el = document.getElementById("booking-card")
        el?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)
    }
  }, [])

  const handleDestinationSelect = (fromCode: string, toCode: string) => {
    setPrefillDestination({ from: fromCode, to: toCode })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero prefillDestination={prefillDestination} />
        <TopDestinations onDestinationSelect={handleDestinationSelect} />
        <Features />
        <FlightExperience />
        <Stats />
        <HowItWorks />
        <HelpCta />
        <Footer />
      </main>
    </div>
  )
}
