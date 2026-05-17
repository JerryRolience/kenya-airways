import { Plane } from "lucide-react"
import { SiX, SiInstagram, SiFacebook } from "react-icons/si"
import { FaLinkedinIn } from "react-icons/fa"

const groups = [
  {
    title: "Fly",
    links: [
      { label: "Search flights", href: "#" },
      { label: "Manage booking", href: "/dashboard/bookings" },
      { label: "Check-in", href: "/dashboard/check-in" },
      { label: "Flight status", href: "/dashboard/flight" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Cabins", href: "#" },
      { label: "Lounges", href: "#" },
      { label: "SkyMiles", href: "#" },
      { label: "Inflight menu", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "#" },
      { label: "Sustainability", href: "#" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact", href: "#" },
      { label: "Help center", href: "/help" },
      { label: "Travel advisories", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
  },
]

const socials = [
  { Icon: SiX, href: "#", label: "Follow us on X (Twitter)" },
  { Icon: SiInstagram, href: "#", label: "Follow us on Instagram" },
  { Icon: SiFacebook, href: "#", label: "Follow us on Facebook" },
  { Icon: FaLinkedinIn, href: "#", label: "Connect on LinkedIn" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane className="h-4 w-4 -rotate-45" />
              </span>
              <span className="font-display text-lg font-semibold">
                Kenya <span className="text-accent">Airways</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">Kenya Airways Online — book, manage, and track your flights across the world, 24/7.</p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:col-span-8 md:grid-cols-4">
            {groups.map(g => (
              <div key={g.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground">{g.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map(l => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Kenya Airways Online Systems. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
            <a href="#" className="hover:text-foreground">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
