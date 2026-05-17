import { PassengerProfileData } from "@/types/profile"
import { Calendar, Globe, Hash, User, UserCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { DetailRow } from "./utils"
import { format } from "date-fns"

export function PassengerInfoCard({ passenger }: { passenger: PassengerProfileData }) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <UserCircle className="h-4 w-4 text-accent" />
          Passenger Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <DetailRow icon={User} label="Title" value={passenger.title || "Not set"} />
        <DetailRow icon={Hash} label="Passport Number" value={passenger.passportNumber || "Not set"} />
        <DetailRow icon={Globe} label="Nationality" value={passenger.nationality || "Not set"} />
        <DetailRow icon={Calendar} label="Date of Birth" value={passenger.dateOfBirth ? format(new Date(passenger.dateOfBirth), "MMMM d, yyyy") : "Not set"} />
      </CardContent>
    </Card>
  )
}
