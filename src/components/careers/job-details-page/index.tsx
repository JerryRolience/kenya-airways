"use client"

import { useFetchJobOpening } from "@/hooks/job/use-fetch-public-job-opening"
import { useUser } from "@clerk/nextjs"
import { useState } from "react"
import { toast } from "sonner"
import { JobApplicationSuccess } from "./job-application-success"
import { JobDetailsPageContent } from "./job-details-page-content"
import { JobDetailsPageHeader } from "./job-details-page-header"

export function JobDetailPage({ openingId }: { openingId: string }) {
  const { user, isLoaded } = useUser()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { data: response, isLoading, isError, error, refetch } = useFetchJobOpening(openingId)
  const opening = response?.success ? response.data : null

  const handleApply = async () => {
    if (!isLoaded || !user) {
      toast.error("Please sign in to apply.")
      return
    }

    setSubmitting(true)

    setSubmitted(true)
    toast.success("Application submitted successfully!")
  }

  if (submitted) {
    return <JobApplicationSuccess title={opening.title} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <JobDetailsPageHeader opening={opening} />

      {/* Content */}
      <JobDetailsPageContent handleApply={handleApply} opening={opening} submitting={submitting} />
    </div>
  )
}
