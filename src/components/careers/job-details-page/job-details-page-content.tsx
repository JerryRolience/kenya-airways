// components/careers/job-details-page-content.tsx
"use client"

import { JobApplicationForm } from "@/components/forms/job-application-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { JobOpeningListItem } from "@/types/job-opening"
import { Briefcase, Building2, CheckCircle2, MapPin, Send } from "lucide-react"
import { useState } from "react"
import { JobApplicationSuccess } from "./job-application-success"

interface JobDetailsPageContentProps {
  opening: JobOpeningListItem
}

export function JobDetailsPageContent({ opening }: JobDetailsPageContentProps) {
  const [applicationOpen, setApplicationOpen] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleApplicationSuccess = () => {
    setApplicationOpen(false)
    setIsSubmitted(true)
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Job Description */}
          <div className="lg:col-span-2">
            <Card className="border-border/60 bg-card p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                <p>{opening.description}</p>
              </div>
            </Card>

            {/* Apply Button (Mobile) */}
            <div className="mt-6 lg:hidden">
              {!isSubmitted ? (
                <Button onClick={() => setApplicationOpen(true)} className="w-full rounded-xl h-12 bg-accent text-accent-foreground hover:bg-accent/90 hover:cursor-pointer">
                  <Send className="mr-2 h-4 w-4" />
                  Apply for this position
                </Button>
              ) : (
                <JobApplicationSuccess title={opening.title} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply Card (Desktop) */}
            <Card className="border-border/60 bg-card p-5 sticky top-24">
              {!isSubmitted ? (
                <div className="text-center">
                  <Send className="h-8 w-8 text-accent mx-auto" />
                  <h3 className="font-display text-lg font-semibold text-foreground mt-3">Interested?</h3>
                  <p className="text-xs text-muted-foreground mt-1">Submit your application now</p>
                  <Button onClick={() => setApplicationOpen(true)} className="w-full mt-4 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 hover:cursor-pointer">
                    Apply now
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 mx-auto">
                    <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-3">Application Submitted!</h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Thank you for applying for <span className="font-medium text-foreground">{opening.title}</span>. We&apos;ll review your application and get back to you within 2 weeks.
                  </p>
                </div>
              )}
            </Card>

            {/* Quick Info */}
            <Card className="border-border/60 bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium text-foreground">{opening.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium text-foreground">Nairobi, Kenya</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground">Full-time</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      <JobApplicationForm openingId={opening.id} openingTitle={opening.title} open={applicationOpen} setOpen={setApplicationOpen} onSuccess={handleApplicationSuccess} />
    </section>
  )
}
