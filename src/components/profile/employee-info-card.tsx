import { EmployeeProfileData } from "@/types/profile"
import { Building2, UserCircle, Shield, Hash } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { DetailRow } from "./utils"

export function EmployeeInfoCard({ employee }: { employee: EmployeeProfileData }) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-accent" />
          Employment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <DetailRow icon={Hash} label="Employee Number" value={employee.employeeNo} />
        <DetailRow icon={Building2} label="Department" value={employee.department} />
        <DetailRow icon={UserCircle} label="Position" value={employee.position} />
        <DetailRow icon={Shield} label="Status" value={employee.isActive ? "Active" : "Inactive"} valueClassName={employee.isActive ? "text-emerald-600" : "text-muted-foreground"} />
      </CardContent>
    </Card>
  )
}
