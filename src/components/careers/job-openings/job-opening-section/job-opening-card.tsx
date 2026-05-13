"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { JobOpeningListItem } from "@/types/job-opening"
import { ArrowRight, Clock, MapPin, Users } from "lucide-react"

export function JobOpeningCard({ opening }: { opening: JobOpeningListItem }) {
  return (
    <Card className="group border-border/60 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elegant cursor-pointer">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-accent transition-colors">{opening.title}</h3>
            <Badge variant="outline" className="text-[10px] border-accent/30 text-accent bg-accent/5">
              {opening.department}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{opening.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Nairobi, Kenya
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(opening.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {opening.applicationsCount} applicant
              {opening.applicationsCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl text-xs group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all">
            View Details
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
