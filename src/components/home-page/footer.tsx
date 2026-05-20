// components/home-page/footer.tsx
"use client"

import { Plane } from "lucide-react"
import { SiX, SiInstagram, SiFacebook } from "react-icons/si"
import { FaLinkedinIn } from "react-icons/fa"
import Link from "next/link"

// ✅ Only links that exist in the application
const groups = [
  {
    title: "Fly",
    links: [
      { label: "Search flights", href: "/#booking-card" },
      { label: "Manage booking", href: "/dashboard/bookings" },
    ],
  },
  {
    title: "Experience",
    links: [
      { label: "Cabins", href: "/help/cabins" },
      { label: "Baggage policy", href: "/help/baggage" },
      { label: "How to book", href: "/help/booking" },
      { label: "FAQs", href: "/help/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Careers", href: "/careers" },
      { label: "Help center", href: "/help" },
      { label: "Contact support", href: "/help#contact" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Sign in", href: "/auth" },
      { label: "My dashboard", href: "/dashboard" },
      { label: "My bookings", href: "/dashboard/bookings" },
      { label: "My profile", href: "/dashboard/profile" },
    ],
  },
]

const socials = [
  { Icon: SiX, href: "https://x.com/Ra92907928Jerry", label: "Follow us on X (Twitter)" },
  { Icon: SiInstagram, href: "https://www.instagram.com/__jerry__rawlings__/", label: "Follow us on Instagram" },
  { Icon: SiFacebook, href: "https://www.facebook.com/profile.php?id=100090024887995", label: "Follow us on Facebook" },
  { Icon: FaLinkedinIn, href: "https://www.linkedin.com/in/jerry-rawlings-182770335/", label: "Connect on LinkedIn" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:-rotate-6">
                <Plane className="h-4 w-4 -rotate-45" />
              </span>
              <span className="font-display text-lg font-semibold">
                Kenya <span className="text-accent">Airways</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">Kenya Airways Online — book, manage, and track your flights across the world, 24/7.</p>
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

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-6 md:col-span-8 md:grid-cols-4">
            {groups.map(g => (
              <div key={g.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground">{g.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map(l => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Kenya Airways Online Systems. All rights reserved.</div>
          <div className="flex gap-5">
            <Link href="/help#privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/help#terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
