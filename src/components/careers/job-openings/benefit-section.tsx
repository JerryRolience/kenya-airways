import { Card } from "@/components/ui/card"
import { Coffee, Globe, GraduationCap, Heart, Plane, Users } from "lucide-react"

const benefits = [
  {
    icon: Plane,
    title: "Travel Privileges",
    description: "Enjoy discounted flights for you and your family across our global network.",
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive medical coverage and wellness programs for all employees.",
  },
  {
    icon: GraduationCap,
    title: "Career Development",
    description: "Continuous learning opportunities, training programs, and career growth paths.",
  },
  {
    icon: Globe,
    title: "Global Exposure",
    description: "Work with diverse teams across Africa, Europe, Asia, and the Americas.",
  },
  {
    icon: Coffee,
    title: "Work-Life Balance",
    description: "Flexible working arrangements and generous leave policies.",
  },
  {
    icon: Users,
    title: "Inclusive Culture",
    description: "Join a diverse workforce that celebrates different perspectives and backgrounds.",
  },
]

export function BenefitSection() {
  return (
    <section className="py-16 border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why Kenya Airways</span>
          <h2 className="font-display mt-2 text-3xl font-bold text-foreground md:text-4xl">Benefits & perks</h2>
          <p className="mt-2 text-sm text-muted-foreground">We take care of our team so they can take care of our passengers.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(benefit => (
            <Card key={benefit.title} className="border-border/60 bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-elegant">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <benefit.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display mt-4 text-base font-semibold text-foreground">{benefit.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
