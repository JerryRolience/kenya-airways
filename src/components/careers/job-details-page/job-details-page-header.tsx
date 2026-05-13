import { Badge } from "@/components/ui/badge"
import { JobOpeningListItem } from "@/types/job-opening"
import { ArrowLeft, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"

export function JobDetailsPageHeader({ opening }: { opening: JobOpeningListItem }) {
  return (
    <section className="bg-linear-to-br from-primary via-primary/95 to-primary/90 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link href="/careers" className="inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to careers
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs">{opening.department}</Badge>
        </div>
        <h1 className="font-display text-3xl font-bold text-white md:text-4xl">{opening.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/70">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Nairobi, Kenya
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Posted{" "}
            {new Date(opening.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {opening.applicationsCount} applicant
            {opening.applicationsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </section>
  )
}
