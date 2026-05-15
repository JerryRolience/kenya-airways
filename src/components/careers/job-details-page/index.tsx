"use client"

import { useFetchJobOpening } from "@/hooks/job/use-fetch-public-job-opening"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { toast } from "sonner"
import { JobApplicationSuccess } from "./job-application-success"
import { JobDetailsPageContent } from "./job-details-page-content"
import { JobDetailsPageHeader } from "./job-details-page-header"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, RefreshCw, Briefcase } from "lucide-react"
import Link from "next/link"
import { AppError } from "@/lib/app-error"

export function JobDetailPage({ openingId }: { openingId: string }) {
  const { user, isLoaded } = useUser()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { data: response, isLoading, isError, error, refetch, isFetching } = useFetchJobOpening(openingId)

  const opening = response?.success ? response.data : null

  const errorMessage = error instanceof AppError ? error.message : "We couldn't load this job opening. Please try again."

  const handleApply = async () => {
    if (!isLoaded || !user) {
      toast.error("Please sign in to apply.")
      return
    }

    setSubmitting(true)

    // TODO: Call actual apply action
    // const result = await applyForOpening({ openingId, coverLetter, cvUrl });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    toast.success("Application submitted successfully!")
    setSubmitting(false)
  }

  if (submitted) {
    return <JobApplicationSuccess title={opening?.title || "this position"} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/*  Loading State  */}
      {isLoading && (
        <div className="animate-pulse">
          {/* Header skeleton */}
          <section className="bg-linear-to-br from-primary via-primary/95 to-primary/90 py-12">
            <div className="mx-auto max-w-4xl px-4">
              <Skeleton className="h-4 w-24 bg-white/20 mb-4" />
              <Skeleton className="h-8 w-64 bg-white/20 mb-2" />
              <Skeleton className="h-5 w-48 bg-white/20" />
            </div>
          </section>

          {/* Content skeleton */}
          <section className="py-10">
            <div className="mx-auto max-w-4xl px-4">
              <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <Skeleton className="h-40 w-full rounded-2xl" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-32 w-full rounded-2xl" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/*  Error State  */}
      {isError && !isLoading && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="mt-5 text-xl font-bold text-foreground font-display">Failed to load job details</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{errorMessage}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button onClick={() => refetch()} disabled={isFetching} variant="outline" className="rounded-xl text-sm gap-2">
                <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                Try again
              </Button>
              <Link href="/careers">
                <Button className="rounded-xl text-sm gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to careers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/*  Not Found / Closed State  */}
      {!isLoading && !isError && !opening && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto">
              <Briefcase className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h1 className="mt-5 text-xl font-bold text-foreground font-display">Opening not found</h1>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">This job opening may have been closed or removed. Please check our other available positions.</p>
            <Link href="/careers" className="mt-6 inline-block">
              <Button className="rounded-xl text-sm gap-2">
                <ArrowLeft className="h-4 w-4" />
                View all openings
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/*  Data State  */}
      {!isLoading && !isError && opening && (
        <>
          {/* Header */}
          <JobDetailsPageHeader opening={opening} />

          {/* Content */}
          <JobDetailsPageContent
            handleApply={handleApply}
            opening={opening}
            submitting={submitting}
            // isLoggedIn={isLoaded && !!user}
          />
        </>
      )}
    </div>
  )
}
