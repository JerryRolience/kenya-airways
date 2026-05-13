"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RefreshCw } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface DataTableErrorStateProps {
  onRetry?: () => void
  message?: string
  className?: string
}

export function DataTableErrorState({
  onRetry,
  message = "Something went wrong while loading data.",
  className,
}: DataTableErrorStateProps) {
  const [retrying, setRetrying] = useState(false)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const len = el.getTotalLength()
    el.style.strokeDasharray = `${len}`
    el.style.strokeDashoffset = `${len}`
    const t = setTimeout(() => {
      el.style.transition = "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)"
      el.style.strokeDashoffset = "0"
    }, 100)
    return () => clearTimeout(t)
  }, [])

  const handleRetry = () => {
    setRetrying(true)
    setTimeout(() => {
      onRetry?.()
      setRetrying(false)
    }, 600)
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-14 px-4 text-center", className)}>
      {/* Animated warning icon */}
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-destructive/8"
        style={{ animation: "popIn 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        <svg viewBox="0 0 40 40" fill="none" className="h-9 w-9">
          {/* Animated triangle outline */}
          <path
            ref={pathRef}
            d="M20 6L36 33H4L20 6Z"
            stroke="hsl(var(--destructive))"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Exclamation — fades in after stroke draws */}
          <line
            x1="20"
            y1="16"
            x2="20"
            y2="24"
            stroke="hsl(var(--destructive))"
            strokeWidth="2"
            strokeLinecap="round"
            style={{ animation: "fadeIn 0.3s 0.7s ease-out both" }}
          />
          <circle cx="20" cy="28" r="1.2" fill="hsl(var(--destructive))" style={{ animation: "fadeIn 0.3s 0.8s ease-out both" }} />
        </svg>
      </div>

      <div className="space-y-1" style={{ animation: "fadeUp 0.4s 0.3s ease-out both" }}>
        <p className="text-sm font-medium text-foreground">Failed to load data</p>
        <p className="text-xs text-muted-foreground max-w-xs">{message}</p>
      </div>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRetry}
          disabled={retrying}
          className="gap-2 h-8 hover:cursor-pointer"
          style={{ animation: "fadeUp 0.4s 0.45s ease-out both" }}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", retrying && "animate-spin")} />
          Try again
        </Button>
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
