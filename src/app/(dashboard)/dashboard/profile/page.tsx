"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { format } from "date-fns"
import { AlertCircle, Calendar, Mail, Phone, Shield, User } from "lucide-react"

const ROLE_STYLES: Record<string, string> = {
  PASSENGER: "bg-blue-100 text-blue-700 border-blue-200",
  EMPLOYEE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  ADMIN: "bg-purple-100 text-purple-700 border-purple-200",
  SUPER_ADMIN: "bg-amber-100 text-amber-700 border-amber-200",
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-10 w-10 text-destructive/60 mx-auto" />
        <p className="mt-3 text-sm text-muted-foreground">You must be signed in to view your profile.</p>
      </div>
    )
  }

  const role = (user.publicMetadata as any)?.role || "PASSENGER"

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information and account settings.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Account Info Card */}
        <Card className="border-border/60 bg-card h-fit">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5">
                <User className="h-10 w-10" />
              </div>
            </div>

            {/* Name */}
            <div className="text-center">
              <p className="font-display text-lg font-semibold text-foreground">{user.fullName || "User"}</p>
              <Badge variant="outline" className={cn("text-[10px] mt-1", ROLE_STYLES[role] || "")}>
                {role}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-3 pt-4 border-t border-border/60">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-foreground truncate">{user.primaryEmailAddress?.emailAddress || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-medium text-foreground">{user.phoneNumbers?.[0]?.phoneNumber || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Role</p>
                  <p className="text-sm font-medium text-foreground capitalize">{role.toLowerCase().replace("_", " ")}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Member Since</p>
                  <p className="text-sm font-medium text-foreground">{user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
