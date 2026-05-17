import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ProfileData } from "@/types/profile"
import { format } from "date-fns"
import { Calendar, Mail, Phone, Shield, User } from "lucide-react"
import { Role } from "../../../generated/prisma/enums"
import { DetailRow, LinksCard } from "./utils"

export function UserProfileAccountInfo({ profile, dashboardType }: { profile: ProfileData; dashboardType: "admin" | "user" }) {
  const isAdmin = profile.role === Role.ADMIN || profile.role === Role.SUPER_ADMIN

  return (
    <div className="space-y-6">
      {/* Avatar Card */}
      <Card className="border-border/60 bg-card overflow-hidden">
        <div className="bg-linear-to-br from-primary via-primary/95 to-primary/90 py-10 px-8 text-center -mt-8">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-white ring-4 ring-white/10">
              <User className="h-12 w-12" />
            </div>
          </div>
          <h2 className="font-display text-xl font-bold text-white mt-4">
            {profile.firstName} {profile.lastName}
          </h2>
          <Badge variant="outline" className={cn("text-[10px] mt-2 border-white/30 text-white bg-white/10")}>
            {profile.role.replace("_", " ")}
          </Badge>
        </div>
        <CardContent className="p-5 space-y-4">
          <DetailRow icon={Mail} label="Email" value={profile.email} />
          <DetailRow icon={Phone} label="Phone" value={profile.phone || "Not set"} />
          <DetailRow icon={Shield} label="Role" value={profile.role.replace("_", " ")} />
          <DetailRow icon={Calendar} label="Member Since" value={format(new Date(profile.createdAt), "MMMM d, yyyy")} />
        </CardContent>
      </Card>

      {/* Quick Links */}
      <LinksCard dashboardType={dashboardType} isAdmin={isAdmin} />
    </div>
  )
}
