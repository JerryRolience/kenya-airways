"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Calendar, Edit, Globe, Hash, Mail, Phone, Ticket, User, UserCircle } from "lucide-react"

interface PassengerDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  passengerId: string | null
  onEdit?: (id: string) => void
}

export function PassengerDetailSheet({ open, onOpenChange, passengerId, onEdit }: PassengerDetailSheetProps) {
  // Replace with actual data fetching
  const isLoading = false
  const passenger = null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg lg:max-w-xl overflow-y-auto p-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : passenger ? (
          <>
            {/* Header with Avatar */}
            <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-white">
                  <User className="h-10 w-10" />
                </div>
              </div>
              <SheetHeader>
                <SheetTitle className="text-white font-display text-xl">
                  {passenger.title && `${passenger.title} `}
                  {passenger.firstName} {passenger.lastName}
                </SheetTitle>
              </SheetHeader>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge className="bg-accent/20 text-accent-foreground border-accent/30 text-xs capitalize">{passenger.relationship?.toLowerCase() || "Self"}</Badge>
                {passenger.userId ? (
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs">Registered User</Badge>
                ) : (
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs">Guest</Badge>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <Ticket className="h-4 w-4 text-accent mb-1 mx-auto" />
                  <p className="text-lg font-bold font-display">{passenger.bookingsCount || 0}</p>
                  <p className="text-[10px] text-white/60">Bookings</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <Calendar className="h-4 w-4 text-accent mb-1 mx-auto" />
                  <p className="text-sm font-bold font-display">{format(new Date(passenger.createdAt), "MMM d, yyyy")}</p>
                  <p className="text-[10px] text-white/60">Member Since</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-accent" />
                  Contact Information
                </h4>
                <div className="mt-3 space-y-3">
                  <DetailItem icon={Mail} label="Email" value={passenger.email} />
                  <DetailItem icon={Phone} label="Phone" value={passenger.phone} />
                </div>
              </div>

              <Separator />

              {/* Travel Documents */}
              <div>
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-accent" />
                  Travel Documents
                </h4>
                <div className="mt-3 space-y-3">
                  <DetailItem icon={Hash} label="Passport Number" value={passenger.passportNumber || "Not provided"} />
                  <DetailItem icon={Globe} label="Nationality" value={passenger.nationality || "Not provided"} />
                  <DetailItem icon={Calendar} label="Date of Birth" value={passenger.dateOfBirth ? format(new Date(passenger.dateOfBirth), "MMM d, yyyy") : "Not provided"} />
                </div>
              </div>

              <Separator />

              {/* Linked Account */}
              {passenger.userId && (
                <>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-accent" />
                      Linked Account
                    </h4>
                    <div className="mt-3 space-y-3">
                      <DetailItem icon={Mail} label="User Email" value={passenger.userEmail || "N/A"} />
                      <DetailItem icon={UserCircle} label="Role" value={passenger.userRole || "Passenger"} />
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Actions */}
              {onEdit && (
                <Button onClick={() => onEdit(passenger.id)} className="w-full rounded-xl">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Passenger
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <User className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="mt-4 text-sm text-muted-foreground">Passenger not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
