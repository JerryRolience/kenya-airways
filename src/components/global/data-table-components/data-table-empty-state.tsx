"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useEffect, useRef } from "react"

interface DataTableEmptyStateProps {
  icon?: LucideIcon
  title?: string
  description?: string
  className?: string
}

export function DataTableEmptyState({
  icon: Icon,
  title = "No results found",
  description = "Try adjusting your search or filters.",
  className,
}: DataTableEmptyStateProps) {
  const circleRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const el = circleRef.current
    if (!el) return
    el.style.strokeDashoffset = "251"
    const t = setTimeout(() => {
      el.style.transition = "stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)"
      el.style.strokeDashoffset = "0"
    }, 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-14 px-4 text-center", className)}>
      {/* Animated ring + icon */}
      <div className="relative flex items-center justify-center">
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute">
          <circle
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1.5"
            strokeDasharray="226"
            strokeDashoffset="226"
            strokeLinecap="round"
            ref={circleRef}
            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
        </svg>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/60">
          {Icon ? (
            <Icon className="h-7 w-7 text-muted-foreground/50" style={{ animation: "fadeUp 0.5s 0.4s ease-out both" }} />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-muted-foreground/50"
              style={{ animation: "fadeUp 0.5s 0.4s ease-out both" }}
            >
              <path
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>

      <div className="space-y-1" style={{ animation: "fadeUp 0.5s 0.3s ease-out both" }}>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
