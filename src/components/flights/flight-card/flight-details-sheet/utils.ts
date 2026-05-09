import { Armchair, Baby, Briefcase, Coffee, Luggage, Monitor, PawPrint, Utensils, Wifi } from "lucide-react"
import { ClassType } from "../../../../../generated/prisma/enums"
import { Amenity, BaggageAllowance } from "./types"

export const CLASS_AMENITIES: Record<ClassType, Amenity[]> = {
  EXECUTIVE: [
    { icon: Armchair, label: "Lie-flat seat with direct aisle access", included: true },
    { icon: Coffee, label: "Premium lounge access", included: true, note: "All airports" },
    { icon: Utensils, label: "Chef-curated 3-course dining", included: true },
    { icon: Wifi, label: "Complimentary high-speed WiFi", included: true },
    { icon: Monitor, label: '18" personal entertainment screen', included: true },
    { icon: Briefcase, label: "Priority baggage handling", included: true },
    { icon: Baby, label: "Infant bassinet available", included: true, note: "On request" },
    { icon: PawPrint, label: "Pet in cabin", included: false },
  ],
  MIDDLE: [
    { icon: Armchair, label: "Premium recliner with extra legroom", included: true },
    { icon: Coffee, label: "Priority check-in", included: true },
    { icon: Utensils, label: "Enhanced meal service", included: true },
    { icon: Wifi, label: "WiFi (pay per use)", included: true, note: "From $5.99" },
    { icon: Monitor, label: '12" personal entertainment screen', included: true },
    { icon: Briefcase, label: "Priority baggage", included: true },
    { icon: Baby, label: "Infant bassinet available", included: true, note: "On request" },
    { icon: PawPrint, label: "Pet in cabin", included: false },
  ],
  ECONOMY: [
    { icon: Armchair, label: "Comfortable seat with adjustable headrest", included: true },
    { icon: Coffee, label: "Complimentary water & soft drinks", included: true },
    { icon: Utensils, label: "Light meal or snack", included: true, note: "Based on duration" },
    { icon: Wifi, label: "WiFi (pay per use)", included: true, note: "From $5.99" },
    { icon: Monitor, label: "Shared overhead screens", included: true },
    { icon: Briefcase, label: "Standard baggage", included: true },
    { icon: Baby, label: "Infant on lap", included: true },
    { icon: PawPrint, label: "Pet in cabin", included: false },
  ],
}

export const BAGGAGE_ALLOWANCES: Record<ClassType, BaggageAllowance[]> = {
  EXECUTIVE: [
    { type: "Cabin Bag", cabin: "2 pieces (12kg total)", checked: "3 pieces (32kg each)", icon: Briefcase },
    { type: "Checked Bag", cabin: "—", checked: "3 pieces (32kg each)", icon: Luggage },
  ],
  MIDDLE: [
    { type: "Cabin Bag", cabin: "2 pieces (10kg total)", checked: "2 pieces (23kg each)", icon: Briefcase },
    { type: "Checked Bag", cabin: "—", checked: "2 pieces (23kg each)", icon: Luggage },
  ],
  ECONOMY: [
    { type: "Cabin Bag", cabin: "1 piece (7kg)", checked: "2 pieces (23kg each)", icon: Briefcase },
    { type: "Checked Bag", cabin: "—", checked: "2 pieces (23kg each)", icon: Luggage },
  ],
}

export const FARE_RULES: Record<ClassType, string[]> = {
  EXECUTIVE: [
    "Fully refundable — cancel anytime for a full refund",
    "Free date changes up to 2 hours before departure",
    "Name changes permitted (fee may apply)",
    "SkyMiles earning: 200% base miles",
    "Priority standby on earlier flights at no charge",
  ],
  MIDDLE: [
    "Refundable with KES 5,000 cancellation fee",
    "Free date changes up to 24 hours before departure",
    "Name changes permitted (fee applies)",
    "SkyMiles earning: 150% base miles",
    "Standby available for a small fee",
  ],
  ECONOMY: [
    "Non-refundable — cancel for travel credit (fee applies)",
    "Date changes: KES 3,000 + fare difference",
    "Name changes not permitted",
    "SkyMiles earning: 100% base miles",
    "Standby not available",
  ],
}
