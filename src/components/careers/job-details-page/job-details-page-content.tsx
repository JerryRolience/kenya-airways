"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { JobOpeningListItem } from "@/types/job-opening"
import { useUser } from "@clerk/nextjs"
import { Briefcase, Building2, Loader2, MapPin, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function JobDetailsPageContent({ opening, submitting, handleApply }: { opening: JobOpeningListItem; submitting: boolean; handleApply: () => void }) {
  const { user, isLoaded } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [cvUrl, setCvUrl] = useState("")

  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Job Description */}
          <div className="lg:col-span-2">
            <Card className="border-border/60 bg-card p-6">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{opening.description}</p>
              </div>
            </Card>

            {/* Apply Button (Mobile) */}
            <div className="mt-6 lg:hidden">
              {!showForm ? (
                <Button onClick={() => setShowForm(true)} className="w-full rounded-xl h-12 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Send className="mr-2 h-4 w-4" />
                  Apply for this position
                </Button>
              ) : (
                <ApplicationForm
                  coverLetter={coverLetter}
                  setCoverLetter={setCoverLetter}
                  cvUrl={cvUrl}
                  setCvUrl={setCvUrl}
                  submitting={submitting}
                  onSubmit={handleApply}
                  onCancel={() => setShowForm(false)}
                  isLoggedIn={isLoaded && !!user}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply Card (Desktop) */}
            <Card className="border-border/60 bg-card p-5 sticky top-24">
              {!showForm ? (
                <div className="text-center">
                  <Send className="h-8 w-8 text-accent mx-auto" />
                  <h3 className="font-display text-lg font-semibold text-foreground mt-3">Interested?</h3>
                  <p className="text-xs text-muted-foreground mt-1">Submit your application now</p>
                  <Button onClick={() => setShowForm(true)} className="w-full mt-4 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
                    Apply now
                  </Button>
                </div>
              ) : (
                <ApplicationForm
                  coverLetter={coverLetter}
                  setCoverLetter={setCoverLetter}
                  cvUrl={cvUrl}
                  setCvUrl={setCvUrl}
                  submitting={submitting}
                  onSubmit={handleApply}
                  onCancel={() => setShowForm(false)}
                  isLoggedIn={isLoaded && !!user}
                />
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
    </section>
  )
}

function ApplicationForm({
  coverLetter,
  setCoverLetter,
  cvUrl,
  setCvUrl,
  submitting,
  onSubmit,
  onCancel,
  isLoggedIn,
}: {
  coverLetter: string
  setCoverLetter: (v: string) => void
  cvUrl: string
  setCvUrl: (v: string) => void
  submitting: boolean
  onSubmit: () => void
  onCancel: () => void
  isLoggedIn: boolean
}) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-base font-semibold text-foreground">Submit your application</h3>

      {!isLoggedIn && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-700">
          You need to{" "}
          <Link href="/sign-in" className="font-medium underline">
            sign in
          </Link>{" "}
          to apply for this position.
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs">Cover Letter</Label>
        <Textarea
          value={coverLetter}
          onChange={e => setCoverLetter(e.target.value)}
          placeholder="Tell us why you're a great fit for this role..."
          className="min-h-32 rounded-xl resize-none"
          disabled={!isLoggedIn}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">CV / Resume URL (optional)</Label>
        <Input value={cvUrl} onChange={e => setCvUrl(e.target.value)} placeholder="https://drive.google.com/your-cv.pdf" className="h-10 rounded-xl" disabled={!isLoggedIn} />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSubmit} disabled={submitting || !isLoggedIn} className="flex-1 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90">
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
        <Button onClick={onCancel} variant="outline" className="rounded-xl">
          Cancel
        </Button>
      </div>
    </div>
  )
}
