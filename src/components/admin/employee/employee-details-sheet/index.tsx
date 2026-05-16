"use client"

import { DetailItem } from "@/components/global/sheets/detail-item"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { EmployeeListItem } from "@/types/employee"
import { format } from "date-fns"
import { Briefcase, Building2, Calendar, Clock, Edit, Hash, Mail, Phone, Shield, User, UserCheck, UserCircle, UserX } from "lucide-react"

interface EmployeeDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: EmployeeListItem
  onEdit: () => void
}

export function EmployeeDetailSheet({ open, onOpenChange, employee, onEdit }: EmployeeDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl lg:max-w-2xl overflow-y-auto p-0">
        {/*  Header  */}
        <div className="bg-linear-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground p-6 text-center">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-white ring-4 ring-white/10">
              <User className="h-10 w-10" />
            </div>
          </div>

          <SheetHeader>
            <SheetTitle className="text-white font-display text-xl">
              {employee.firstName} {employee.lastName}
            </SheetTitle>
          </SheetHeader>

          {/* Badges */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs font-mono">{employee.employeeNo}</Badge>
            <Badge
              className={cn(
                "text-xs border",
                employee.isActive ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30" : "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30",
              )}
            >
              {employee.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Building2 className="h-4 w-4 text-accent mb-1 mx-auto" />
              <p className="text-xs font-bold font-display truncate">{employee.department}</p>
              <p className="text-[10px] text-white/60">Department</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-accent mb-1 mx-auto" />
              <p className="text-sm font-bold font-display capitalize">{employee.role?.toLowerCase() || "N/A"}</p>
              <p className="text-[10px] text-white/60">Role</p>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-accent mb-1 mx-auto" />
              <p className="text-sm font-bold font-display">{format(new Date(employee.createdAt), "MMM d, yyyy")}</p>
              <p className="text-[10px] text-white/60">Registered</p>
            </div>
          </div>
        </div>

        {/*  Body  */}
        <div className="p-6 space-y-6">
          {/* Contact Information */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-accent" />
              Contact Information
            </h4>
            <div className="mt-3 space-y-3">
              <DetailItem icon={Mail} label="Email" value={employee.email} />
              <DetailItem icon={Phone} label="Phone" value={employee.phone || "Not provided"} />
            </div>
          </div>

          <Separator />

          {/* Employment Details */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-accent" />
              Employment Details
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <DetailItem icon={Hash} label="Employee No" value={employee.employeeNo} />
              <DetailItem icon={Building2} label="Department" value={employee.department} />
              <DetailItem icon={UserCircle} label="Position" value={employee.position} />
              <DetailItem icon={Shield} label="System Role" value={employee.role || "N/A"} />
            </div>
          </div>

          <Separator />

          {/* Status & Dates */}
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Status & Dates
            </h4>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <DetailItem icon={employee.isActive ? UserCheck : UserX} label="Status" value={employee.isActive ? "Active" : "Inactive"} />
              <DetailItem icon={Calendar} label="Registered" value={format(new Date(employee.createdAt), "MMM d, yyyy")} />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={() => onEdit()} className="flex-1 rounded-xl">
              <Edit className="mr-2 h-4 w-4" />
              Edit Employee
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
