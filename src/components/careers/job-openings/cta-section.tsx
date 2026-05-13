import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div className="rounded-3xl bg-linear-to-br from-primary to-primary/90 p-10 md:p-14 text-primary-foreground">
          <Building2 className="h-10 w-10 text-accent mx-auto" />
          <h2 className="font-display mt-4 text-2xl font-bold md:text-3xl">Don&apos;t see the right role?</h2>
          <p className="mt-2 text-primary-foreground/70 max-w-md mx-auto">Send us your CV and we&apos;ll keep you in mind for future opportunities that match your skills.</p>
          <Button variant="outline" className="mt-6 rounded-xl border-white/30 bg-transparent text-primary-foreground hover:bg-white/10">
            Submit general application
          </Button>
        </div>
      </div>
    </section>
  )
}
