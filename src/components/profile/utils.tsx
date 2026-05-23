import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Briefcase, CreditCard, FileText, LayoutDashboard, LinkIcon, Plane, Ticket, Users } from "lucide-react"
import Link from "next/link"

const QUICK_LINKS = [
  { label: "My Bookings", icon: Ticket, href: "/dashboard/bookings" },
  { label: "My Flights", icon: Plane, href: "/dashboard/flights" },
  { label: "My Applications", icon: Briefcase, href: "/dashboard/applications" },
  { label: "Payment History", icon: CreditCard, href: "/dashboard/payments" },
]

const ADMIN_LINKS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Employees", icon: Users, href: "/admin/employees" },
  { label: "Job Openings", icon: Briefcase, href: "/admin/job-openings" },
  { label: "Matches", icon: LinkIcon, href: "/admin/matches" },
  { label: "Applications", icon: FileText, href: "/admin/applications" },
  { label: "Ticket Report", icon: Ticket, href: "/admin/tickets" },
]

//  Detail Row Component
export function DetailRow({ icon: Icon, label, value, valueClassName }: { icon: React.ElementType; label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className={cn("text-sm font-medium text-foreground", valueClassName)}>{value}</p>
      </div>
    </div>
  )
}

//  Stats Mini Card
export function StatsMiniCard({ icon: Icon, value, label, href, color }: { icon: React.ElementType; value: number; label: string; href: string; color: string }) {
  return (
    <Link href={href}>
      <Card className="border-border/60 bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-elegant cursor-pointer">
        <CardContent className="p-4 flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground font-display">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function LinksCard({ dashboardType }: { dashboardType: "admin" | "user" }) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{dashboardType === "admin" ? "Quick Links" : "Admin Panel"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {dashboardType === "admin" &&
          QUICK_LINKS.map(link => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" className="w-full justify-start text-sm rounded-xl hover:cursor-pointer hover:bg-primary/5">
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}

        {dashboardType === "user" &&
          ADMIN_LINKS.map(link => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" className="w-full justify-start text-sm rounded-xl hover:cursor-pointer hover:bg-primary/5">
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
      </CardContent>
    </Card>
  )
}
