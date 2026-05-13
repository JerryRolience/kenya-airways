import { JobDetailPage as JobDetailClientPage } from "@/components/careers/job-details-page"

export const metadata = {
  title: "Job Details | Kenya Airways Careers",
}

export default async function JobDetailPage({ params }: { params: Promise<{ openingId: string }> }) {
  const { openingId } = await params

  return <JobDetailClientPage openingId={openingId} />
}
