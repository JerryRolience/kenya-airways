"use client"

import { Button } from "@/components/ui/button"
import { Plane, Compass, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center">
      {/*  Animated Background  */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent/5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

        {/* Floating planes */}
        <FloatingPlane delay={0} top="15%" left="10%" rotation={-20} />
        <FloatingPlane delay={2} top="20%" right="15%" rotation={15} />
        <FloatingPlane delay={4} bottom="25%" left="20%" rotation={-10} />
        <FloatingPlane delay={1} bottom="15%" right="10%" rotation={25} />

        {/* Stars / dots */}
        <div className="absolute top-1/4 left-1/3 h-1.5 w-1.5 rounded-full bg-accent/30 animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/3 right-1/4 h-1 w-1 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/3 left-1/4 h-1.5 w-1.5 rounded-full bg-accent/20 animate-pulse" style={{ animationDelay: "2.5s" }} />
        <div className="absolute bottom-1/4 right-1/3 h-1 w-1 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: "3.5s" }} />
      </div>

      {/*  Main Content  */}
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        {/* 404 Number */}
        <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="font-display text-[180px] font-bold leading-none tracking-tighter text-foreground/5 select-none md:text-[250px]">404</h1>
        </div>

        {/* Icon */}
        <div className={`-mt-20 md:-mt-28 transition-all duration-700 delay-200 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" style={{ animationDuration: "3s" }} />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-accent/20 to-accent/5 border border-accent/30 shadow-glow-accent">
                <Compass className="h-12 w-12 text-accent animate-bounce" style={{ animationDuration: "2s" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className={`mt-6 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">Lost in the clouds</h2>
        </div>

        {/* Description */}
        <div className={`mt-3 transition-all duration-700 delay-400 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            This page seems to have flown off course. It might have been moved, renamed, or never existed. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className={`mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Link href="/">
            <Button className="rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 shadow-elegant hover:shadow-glow-accent transition-all duration-300 hover:-translate-y-0.5 hover:cursor-pointer">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/#booking-card" scroll={true} className="scroll-smooth scroll-">
            <Button variant="outline" className="rounded-xl gap-2 h-11 px-6 hover:bg-muted/50 transition-all duration-300 hover:cursor-pointer">
              <Plane className="h-4 w-4 -rotate-45" />
              Book a Flight
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
          <p className="text-xs text-muted-foreground/60">Kenya Airways · The Pride of Africa</p>
        </div>
      </div>
    </div>
  )
}

//  Floating Plane Component
function FloatingPlane({ delay, top, left, right, bottom, rotation }: { delay: number; top?: string; left?: string; right?: string; bottom?: string; rotation: number }) {
  return (
    <div
      className="absolute opacity-20"
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
      <Plane className="h-8 w-8 text-accent" />
    </div>
  )
}
