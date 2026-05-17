import { User, ArrowLeft, HelpCircle } from "lucide-react"
import { Card, CardContent } from "../ui/card"
import Link from "next/link"
import { Button } from "../ui/button"

export function UserProfileEmptyState({ dashboardType }: { dashboardType: "admin" | "user" }) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information and account settings.</p>
      </div>

      {/* Not Found Card */}
      <Card className="border-amber-200/60 bg-amber-50/30 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400/60" />
        <CardContent className="p-8 sm:p-12">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-pulse" style={{ animationDuration: "2s" }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 border border-amber-300/60">
                <User className="h-10 w-10 text-amber-600" />
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-xl font-semibold text-foreground">Profile not found</h2>

            {/* Description */}
            <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
              We couldn&apos;t find your profile in our system. This might be because your account setup hasn&apos;t been completed yet.
            </p>

            {/* Divider */}
            <div className="w-16 h-px bg-amber-300/40 my-5" />

            {/* Suggestions */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>What you can do:</p>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  Complete your account setup
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  Sign out and sign back in
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-amber-400" />
                  Contact support if the issue persists
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <Link href={dashboardType === "admin" ? "/admin/dashboard" : "/dashboard"}>
                <Button className="rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant hover:cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="outline" className="rounded-xl gap-2 hover:cursor-pointer">
                  <HelpCircle className="h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
