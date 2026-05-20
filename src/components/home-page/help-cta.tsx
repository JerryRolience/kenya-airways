"use client"

import { MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HelpCta() {
  const router = useRouter()

  const handleEmailSupport = () => {
    window.location.href = "mailto:jerryrawlings892@gmail.com?subject=Support%20Request&body=Hello%20Kenya%20Airways%20Support%2C%0A%0APlease%20describe%20your%20issue%20here..."
  }

  return (
    <section className="pb-20 md:pb-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground shadow-elegant md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">We are here</span>
              <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Need a hand with your trip?</h2>
              <p className="mt-3 max-w-md text-primary-foreground/75">Our support team is available 24/7. Reach out via email and we&apos;ll get back to you within minutes.</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:justify-end">
              <Button size="lg" className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 hover:cursor-pointer" onClick={handleEmailSupport}>
                <Mail className="mr-2 h-4 w-4" />
                Send us an email
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground hover:cursor-pointer"
                onClick={() => router.push("/help")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Visit Help Center
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
