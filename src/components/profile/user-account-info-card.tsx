import { Clock, Mail, Phone, Shield, Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { DetailRow } from "./utils"
import { ProfileData } from "@/types/profile"
import { format } from "date-fns"

export function UserProfileAccountInfoCard({ profile }: { profile: ProfileData }) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent" />
          Account Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <DetailRow icon={Mail} label="Email Address" value={profile.email} />
        <DetailRow icon={Phone} label="Phone Number" value={profile.phone || "Not set"} />
        <DetailRow icon={Shield} label="Account Role" value={profile.role.replace("_", " ")} />
        <DetailRow icon={Calendar} label="Member Since" value={format(new Date(profile.createdAt), "MMMM d, yyyy")} />
      </CardContent>
    </Card>
  )
}
