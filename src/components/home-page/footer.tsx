import { Plane } from "lucide-react";
import { SiX, SiInstagram, SiFacebook, SiLinkerd } from "react-icons/si";

const groups = [
  {
    title: "Fly",
    links: ["Search flights", "Manage booking", "Check-in", "Flight status"],
  },
  {
    title: "Experience",
    links: ["Cabins", "Lounges", "SkyMiles", "Inflight menu"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Sustainability"],
  },
  {
    title: "Help",
    links: ["Contact", "Help center", "Travel advisories", "Accessibility"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane className="h-4.5 w-4.5" />
              </span>
              <span className="font-display text-lg font-semibold">
                Skyline<span className="text-accent">.</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Premium flights to 240+ destinations. Built for the way you
              actually travel.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[SiX, SiInstagram, SiFacebook, SiLinkerd].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social link"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 md:col-span-8 md:grid-cols-4">
            {groups.map((g) => (
              <div key={g.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  {g.title}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} Skyline Airways. All rights reserved.
          </div>
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
  );
}
