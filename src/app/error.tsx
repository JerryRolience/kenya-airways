"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft, Home, RefreshCw, Wrench } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [mounted, setMounted] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    setMounted(true)
    console.error("Page error:", error)
  }, [error])

  // Auto-retry countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center">
      {/*  Animated Background  */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-destructive/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-destructive/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Animated lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-destructive/20 to-transparent animate-shimmer" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-500/20 to-transparent animate-shimmer" style={{ animationDelay: "1s" }} />

        {/* Wrench icons */}
        <FloatingIcon icon={Wrench} delay={0} top="20%" left="10%" rotation={-15} />
        <FloatingIcon icon={AlertTriangle} delay={2} top="15%" right="15%" rotation={10} />
        <FloatingIcon icon={Wrench} delay={4} bottom="25%" left="15%" rotation={20} />
        <FloatingIcon icon={AlertTriangle} delay={1} bottom="20%" right="10%" rotation={-10} />
      </div>

      {/*  Main Content  */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className={`transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" style={{ animationDuration: "3s", animationDelay: "1.5s" }} />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-destructive/20 via-amber-500/10 to-destructive/5 border border-destructive/30">
                <AlertTriangle className="h-14 w-14 text-destructive animate-pulse" style={{ animationDuration: "2s" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className={`mt-8 transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Turbulence ahead</h2>
        </div>

        {/* Description */}
        <div className={`mt-3 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            We encountered unexpected turbulence while loading this page. Our engineering team has been notified and is working to resolve the issue.
          </p>
        </div>

        {/* Error Details (collapsible) */}
        <div className={`mt-4 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <details className="group">
            <summary className="text-xs text-muted-foreground/60 cursor-pointer hover:text-muted-foreground transition-colors">Technical details</summary>
            <p className="mt-2 text-[10px] text-muted-foreground/40 font-mono bg-muted/30 rounded-lg p-3 max-w-md mx-auto text-left break-all">
              {error.message || "An unknown error occurred."}
              {error.digest && <span className="block mt-1">Digest: {error.digest}</span>}
            </p>
          </details>
        </div>

        {/* Actions */}
        <div className={`mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Button
            onClick={reset}
            className="rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shadow-elegant hover:shadow-glow-accent transition-all duration-300 hover:-translate-y-0.5 hover:cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            {countdown > 0 ? `Try again (${countdown}s)` : "Try again"}
          </Button>
          <Link href="/">
            <Button variant="outline" className="rounded-xl gap-2 h-11 px-6 hover:bg-muted/50 transition-all duration-300 hover:cursor-pointer">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/help">
            <Button variant="ghost" className="rounded-xl gap-2 h-11 px-6 text-muted-foreground hover:text-foreground transition-all duration-300 hover:cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Help Center
            </Button>
          </Link>
        </div>

        {/* Divider */}
        <div className={`mt-10 pt-10 border-t border-border/40 transition-all duration-700 delay-600 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <p className="text-xs text-muted-foreground/60">Kenya Airways · The Pride of Africa · Error ID: {error.digest?.slice(0, 8) || "N/A"}</p>
        </div>
      </div>
    </div>
  )
}

//  Floating Icon Component
function FloatingIcon({
  icon: Icon,
  delay,
  top,
  left,
  right,
  bottom,
  rotation,
}: {
  icon: React.ElementType
  delay: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  rotation: number
}) {
  return (
    <div
      className="absolute opacity-15"
      style={{
        top,
        left,
        right,
        bottom,
        animation: `floatPlane 6s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <Icon className="h-10 w-10 text-destructive" />
    </div>
  )
}
