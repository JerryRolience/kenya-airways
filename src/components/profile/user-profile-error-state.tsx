import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

interface UserProfileErrorStateProps {
  message: string
  refetch: () => void
  dashboardType: "admin" | "user"
}

export function UserProfileErrorState({ message, refetch, dashboardType }: UserProfileErrorStateProps) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information and account settings.</p>
      </div>

      {/* Error Card */}
      <Card className="border-destructive/30 bg-destructive/5 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-destructive/50" />
        <CardContent className="p-8 sm:p-12">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" style={{ animationDuration: "3s" }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 border border-destructive/30">
                <AlertCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>

            {/* Title */}
            <h2 className="font-display text-xl font-semibold text-foreground">Failed to load profile</h2>

            {/* Description */}
            <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">{message}</p>

            {/* Divider */}
            <div className="w-16 h-px bg-destructive/20 my-5" />

            {/* Suggestions */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This might be due to:</p>
              <ul className="space-y-1 text-xs">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-destructive/40" />
                  Temporary connectivity issue
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-destructive/40" />
                  Server maintenance in progress
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-destructive/40" />
                  Session expired
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={() => refetch()}
                className="rounded-xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-elegant hover:shadow-glow-accent transition-all duration-300 hover:-translate-y-0.5"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Link href={dashboardType === "admin" ? "/admin/dashboard" : "/dashboard"}>
                <Button variant="outline" className="rounded-xl gap-2 hover:cursor-pointer">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
