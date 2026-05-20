import { Armchair, Baby, Briefcase, Coffee, Luggage, Monitor, PawPrint, Users, Utensils, Wifi, X } from "lucide-react"
import { ClassType } from "../../generated/prisma/enums"

//  Cabin Class Data
export interface CabinAmenity {
  icon: React.ElementType
  label: string
  included: boolean
  note?: string
}

export interface CabinInfo {
  class: ClassType
  name: string
  tagline: string
  priceFrom: string
  description: string
  seatType: string
  seatPitch: string
  seatWidth: string
  amenities: CabinAmenity[]
  baggage: {
    cabin: string
    checked: string
  }
  fareRules: string[]
}

export const CABIN_DATA: CabinInfo[] = [
  {
    class: ClassType.EXECUTIVE,
    name: "Executive Class",
    tagline: "Lie-flat suites & priority everything",
    priceFrom: "KES 189,000",
    description: "Experience world-class luxury with our Executive Class. Lie-flat seats, chef-curated dining, and exclusive lounge access redefine premium air travel across Africa and beyond.",
    seatType: "Lie-flat suite with direct aisle access",
    seatPitch: "78 inches (fully flat)",
    seatWidth: "22 inches",
    amenities: [
      { icon: Armchair, label: "Lie-flat seat with direct aisle access", included: true },
      { icon: Coffee, label: "Premium lounge access at all airports", included: true },
      { icon: Utensils, label: "Chef-curated 3-course dining", included: true },
      { icon: Wifi, label: "Complimentary high-speed WiFi", included: true },
      { icon: Monitor, label: '18" personal entertainment screen', included: true },
      { icon: Briefcase, label: "Priority baggage handling", included: true },
      { icon: Luggage, label: "Extra baggage allowance", included: true },
      { icon: Baby, label: "Infant bassinet available (on request)", included: true },
      { icon: PawPrint, label: "Pet in cabin", included: false },
    ],
    baggage: {
      cabin: "2 pieces (12kg total)",
      checked: "3 pieces (32kg each)",
    },
    fareRules: [
      "Fully refundable — cancel anytime for a full refund",
      "Free date changes up to 2 hours before departure",
      "Name changes permitted (fee may apply)",
      "SkyMiles earning: 200% base miles",
      "Priority standby on earlier flights at no charge",
      "Complimentary chauffeur service in Nairobi and London",
    ],
  },
  {
    class: ClassType.MIDDLE,
    name: "Middle Class",
    tagline: "Extra space, extra comfort",
    priceFrom: "KES 89,000",
    description: "Enjoy enhanced comfort with our Middle Class. Premium recliner seats, priority check-in, and enhanced meal service make your journey relaxing and productive.",
    seatType: "Premium recliner with extra legroom",
    seatPitch: "38 inches",
    seatWidth: "19 inches",
    amenities: [
      { icon: Armchair, label: "Premium recliner with extra legroom", included: true },
      { icon: Coffee, label: "Priority check-in", included: true },
      { icon: Utensils, label: "Enhanced meal service", included: true },
      { icon: Wifi, label: "WiFi (pay per use from $5.99)", included: true, note: "From $5.99" },
      { icon: Monitor, label: '12" personal entertainment screen', included: true },
      { icon: Briefcase, label: "Priority baggage", included: true },
      { icon: Luggage, label: "Extra baggage allowance", included: true },
      { icon: Baby, label: "Infant bassinet available (on request)", included: true },
      { icon: PawPrint, label: "Pet in cabin", included: false },
    ],
    baggage: {
      cabin: "2 pieces (10kg total)",
      checked: "2 pieces (23kg each)",
    },
    fareRules: [
      "Refundable with KES 5,000 cancellation fee",
      "Free date changes up to 24 hours before departure",
      "Name changes permitted (fee applies)",
      "SkyMiles earning: 150% base miles",
      "Standby available for a small fee",
    ],
  },
  {
    class: ClassType.ECONOMY,
    name: "Economy Class",
    tagline: "Smart fares without compromise",
    priceFrom: "KES 38,000",
    description: "Travel comfortably at a great price with our Economy Class. Comfortable seats, complimentary meals, and personal entertainment ensure a pleasant journey to your destination.",
    seatType: "Comfortable seat with adjustable headrest",
    seatPitch: "32 inches",
    seatWidth: "17.5 inches",
    amenities: [
      { icon: Armchair, label: "Comfortable seat with adjustable headrest", included: true },
      { icon: Coffee, label: "Complimentary water & soft drinks", included: true },
      { icon: Utensils, label: "Light meal or snack (based on duration)", included: true, note: "Based on duration" },
      { icon: Wifi, label: "WiFi (pay per use from $5.99)", included: true, note: "From $5.99" },
      { icon: Monitor, label: "Shared overhead entertainment screens", included: true },
      { icon: Briefcase, label: "Standard baggage", included: true },
      { icon: Luggage, label: "Standard baggage allowance", included: true },
      { icon: Baby, label: "Infant on lap (under 2 years)", included: true },
      { icon: PawPrint, label: "Pet in cabin", included: false },
    ],
    baggage: {
      cabin: "1 piece (7kg)",
      checked: "2 pieces (23kg each)",
    },
    fareRules: [
      "Non-refundable — cancel for travel credit (fee applies)",
      "Date changes: KES 3,000 + fare difference",
      "Name changes not permitted",
      "SkyMiles earning: 100% base miles",
      "Standby not available",
    ],
  },
]

//  Baggage Policy Data
export interface BaggagePolicy {
  category: string
  icon: React.ElementType
  description: string
  items: {
    title: string
    details: string
  }[]
}

export const BAGGAGE_POLICIES: BaggagePolicy[] = [
  {
    category: "Cabin Baggage",
    icon: Briefcase,
    description: "Items you can bring on board with you.",
    items: [
      { title: "Executive Class", details: "2 pieces, maximum 12kg combined weight" },
      { title: "Middle Class", details: "2 pieces, maximum 10kg combined weight" },
      { title: "Economy Class", details: "1 piece, maximum 7kg" },
      { title: "Personal Item", details: "All classes: 1 additional personal item (laptop bag, handbag, or small backpack)" },
      { title: "Size Limit", details: "Cabin bags must not exceed 55cm x 35cm x 25cm" },
    ],
  },
  {
    category: "Checked Baggage",
    icon: Luggage,
    description: "Bags stored in the aircraft hold.",
    items: [
      { title: "Executive Class", details: "3 pieces, maximum 32kg each" },
      { title: "Middle Class", details: "2 pieces, maximum 23kg each" },
      { title: "Economy Class", details: "2 pieces, maximum 23kg each" },
      { title: "Excess Baggage", details: "KES 5,000 per additional kg. Purchase online for a 20% discount." },
      { title: "Size Limit", details: "Checked bags must not exceed 158cm (length + width + height)" },
    ],
  },
  {
    category: "Special Items",
    icon: Luggage,
    description: "Guidelines for sports equipment, musical instruments, and more.",
    items: [
      { title: "Sports Equipment", details: "Golf clubs, skis, and bicycles: Counted as 1 checked bag. Oversized fees may apply." },
      { title: "Musical Instruments", details: "Small instruments can be carried as cabin baggage if they fit in overhead bins. Larger instruments must be checked." },
      { title: "Medical Equipment", details: "Wheelchairs, CPAP machines, and other medical devices are carried free of charge in addition to your allowance." },
      { title: "Infant Items", details: "Collapsible strollers and car seats are carried free of charge for infants." },
    ],
  },
  {
    category: "Prohibited Items",
    icon: X,
    description: "Items not allowed in checked or cabin baggage.",
    items: [
      { title: "Lithium Batteries", details: "Must be carried in cabin baggage only. Spare batteries must be individually protected." },
      { title: "E-cigarettes", details: "Must be carried in cabin baggage. Charging is prohibited on board." },
      { title: "Flammable Items", details: "Lighter fluid, fuel, paints, and thinners are strictly prohibited." },
      { title: "Firearms & Weapons", details: "Must be declared and packed in checked baggage with proper documentation." },
    ],
  },
]

//  Manage Booking Data
export interface ManageTopic {
  id: string
  title: string
  icon: React.ElementType
  description: string
  steps: string[]
  notes: string[]
}

export const MANAGE_TOPICS: ManageTopic[] = [
  {
    id: "change-date",
    title: "Change your flight date",
    icon: Briefcase,
    description: "Need to travel earlier or later? Here's how to change your flight date.",
    steps: [
      "Log in to your account and go to 'Manage Booking'",
      "Enter your booking reference (e.g., KQ-2026-XXXX) and last name",
      "Select the booking you want to modify",
      "Click 'Change flight' and select a new date",
      "Review any fare difference or change fees",
      "Confirm the change — you'll receive a new e-ticket via email",
    ],
    notes: ["Executive: Free date changes up to 2 hours before departure", "Middle: Free date changes up to 24 hours before departure", "Economy: KES 3,000 fee + any fare difference"],
  },
  {
    id: "cancel",
    title: "Cancel your booking",
    icon: X,
    description: "Here's how to cancel your booking and understand our refund policy.",
    steps: [
      "Log in to your account and go to 'Manage Booking'",
      "Enter your booking reference and last name",
      "Select the booking you want to cancel",
      "Click 'Cancel booking' and review the refund details",
      "Confirm cancellation — refund will be processed within 7-14 business days",
    ],
    notes: [
      "Executive: Fully refundable — cancel anytime",
      "Middle: KES 5,000 cancellation fee",
      "Economy: Non-refundable — travel credit issued",
      "Cancel within 24 hours of booking for a full refund on all fares",
    ],
  },
  {
    id: "add-baggage",
    title: "Add extra baggage",
    icon: Luggage,
    description: "Need to carry more? Pre-purchase extra baggage allowance online and save 20%.",
    steps: [
      "Go to 'Manage Booking' and select your booking",
      "Click 'Add extra baggage'",
      "Select the number of extra bags and weight per bag",
      "Pay securely online — KES 5,000 per kg (20% discount online)",
      "Your updated baggage allowance is confirmed instantly",
    ],
    notes: ["Purchase at least 24 hours before departure for the best price", "Excess baggage at the airport: KES 5,000 per kg (no discount)", "Maximum 32kg per individual bag"],
  },
  {
    id: "special-meals",
    title: "Request special meals",
    icon: Utensils,
    description: "We cater to dietary and religious requirements. Request your meal in advance.",
    steps: [
      "Go to 'Manage Booking' and select your booking",
      "Click 'Special requests' → 'Meal preferences'",
      "Select from: Vegetarian, Vegan, Halal, Kosher, Gluten-free, Diabetic, Child meal",
      "Your request is confirmed immediately",
    ],
    notes: [
      "Special meals must be requested at least 48 hours before departure",
      "Meals are subject to availability on short-haul flights",
      "You can also add meal preferences to your passenger profile for future bookings",
    ],
  },
  {
    id: "seat-change",
    title: "Change your seat",
    icon: Armchair,
    description: "Want a different seat? You can change it online up to 2 hours before departure.",
    steps: [
      "Go to 'Manage Booking' and select your booking",
      "Click 'Change seat' to view the seat map",
      "Select a new available seat — green = available, grey = taken",
      "Confirm your new seat assignment",
    ],
    notes: [
      "Seat changes are free for Executive class",
      "Middle class: Free changes up to 24 hours before departure",
      "Economy class: KES 1,000 for standard seat, KES 3,000 for extra legroom",
      "Window and aisle seats are subject to availability",
    ],
  },
  {
    id: "update-passenger",
    title: "Update passenger details",
    icon: Users,
    description: "Correct a name spelling or update contact information.",
    steps: [
      "Go to 'Manage Booking' and select your booking",
      "Click 'Passenger details' → 'Edit'",
      "Make your corrections and save",
      "You'll receive an updated e-ticket if name changes affect the booking",
    ],
    notes: ["Minor name corrections (1-3 characters): Free", "Full name changes: Permitted only on Executive and Middle class (fee applies)", "Contact information can be updated anytime for free"],
  },
]
