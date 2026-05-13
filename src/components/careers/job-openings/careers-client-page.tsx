"use client"

import { BenefitSection } from "./benefit-section"
import { CareersHero } from "./careers-hero"
import { CTASection } from "./cta-section"
import { JobOpeningSection } from "./job-opening-section"

export function CareersClientPage() {
  return (
    <div className="min-h-screen bg-background">
      {/*  Hero Section  */}
      <CareersHero />

      {/*  Job Openings Section  */}
      <JobOpeningSection />

      {/*  Benefits Section  */}
      <BenefitSection />

      {/*  CTA Section  */}
      <CTASection />
    </div>
  )
}
