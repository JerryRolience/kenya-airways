import { Plane, User, Crown, Briefcase, Users, AlertTriangle, CheckCircle, XCircle, Clock, CreditCard, Ticket, MapPin, Ban } from "lucide-react"
import { StatusMeta } from "./lib"

//
// 👤 ROLE
//
export const roleMap: Record<string, StatusMeta> = {
  PASSENGER: {
    label: "Passenger",
    variant: "info",
    icon: User,
  },
  SUPER_ADMIN: {
    label: "Super Admin",
    variant: "destructive",
    icon: Crown,
  },
  ADMIN: {
    label: "Admin",
    variant: "indigo",
    icon: Crown,
  },
  EMPLOYEE: {
    label: "Employee",
    variant: "blue",
    icon: Briefcase,
  },
}

//
// 🟢 ACTIVE / USER / SUPPLIER STATUS
//
export const activeStatusMap: Record<string, StatusMeta> = {
  ACTIVE: {
    label: "Active",
    variant: "success",
    icon: CheckCircle,
    pulse: true,
  },
  INACTIVE: {
    label: "Inactive",
    variant: "neutral",
    icon: XCircle,
  },
  BLACKLISTED: {
    label: "Blacklisted",
    variant: "destructive",
    icon: Ban,
  },
}

//
//  JOB OPENING STATUS
//
export const jobOpeningStatusMap: Record<string, StatusMeta> = {
  OPEN: {
    label: "Open",
    variant: "success",
    icon: CheckCircle,
  },
  CLOSED: {
    label: "Closed",
    variant: "destructive",
    icon: XCircle,
  },
}

//
// 🧾 TITLE
//
export const titleMap: Record<string, StatusMeta> = {
  MR: { label: "Mr", variant: "neutral", icon: User },
  MRS: { label: "Mrs", variant: "pink", icon: User },
  MS: { label: "Ms", variant: "pink", icon: User },
  DR: { label: "Dr", variant: "info", icon: User },
}

//
// 👨‍👩‍👧 PASSENGER RELATION
//
export const passengerRelationMap: Record<string, StatusMeta> = {
  SELF: { label: "Self", variant: "success", icon: User },
  SPOUSE: { label: "Spouse", variant: "pink", icon: Users },
  CHILD: { label: "Child", variant: "info", icon: Users },
  PARENT: { label: "Parent", variant: "purple", icon: Users },
  COLLEAGUE: { label: "Colleague", variant: "blue", icon: Users },
  OTHER: { label: "Other", variant: "neutral", icon: Users },
}

//
// PASSENGER TYPE
//
export const passengerTypeMap: Record<string, StatusMeta> = {
  GUESTS: { label: "Guests", variant: "neutral", icon: User },
  REGISTERED: { label: "Registered", variant: "success", icon: User },
}

//
// ✈️ FLIGHT STATUS
//
export const flightStatusMap: Record<string, StatusMeta> = {
  SCHEDULED: { label: "Scheduled", variant: "info", icon: Clock },
  BOARDING: { label: "Boarding", variant: "warning", icon: Plane, pulse: true },
  DEPARTED: { label: "Departed", variant: "blue", icon: Plane },
  ARRIVED: { label: "Arrived", variant: "success", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", variant: "destructive", icon: XCircle },
  DELAYED: { label: "Delayed", variant: "warning", icon: AlertTriangle, pulse: true },
}

//
// 💺 CLASS TYPE
//
export const classTypeMap: Record<string, StatusMeta> = {
  EXECUTIVE: { label: "Executive (Class A)", variant: "purple", icon: Crown },
  MIDDLE: { label: "Middle (Class B)", variant: "blue", icon: Briefcase },
  ECONOMY: { label: "Economy (Class C)", variant: "neutral", icon: Users },
}

//
// 💺 SEAT POSITION
//
export const seatPositionMap: Record<string, StatusMeta> = {
  WINDOW: { label: "Window Seat", variant: "info", icon: MapPin },
  MIDDLE: { label: "Middle Seat", variant: "neutral", icon: MapPin },
  AISLE: { label: "Aisle Seat", variant: "blue", icon: MapPin },
}

//
// 🎟 BOOKING STATUS
//
export const bookingStatusMap: Record<string, StatusMeta> = {
  PENDING: { label: "Pending", variant: "warning", icon: Clock, pulse: true },
  CONFIRMED: { label: "Confirmed", variant: "success", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", variant: "destructive", icon: XCircle },
  COMPLETED: { label: "Completed", variant: "info", icon: CheckCircle },
}

//
// 💳 PAYMENT STATUS (FLIGHT VERSION)
//
export const flightPaymentStatusMap: Record<string, StatusMeta> = {
  UNPAID: { label: "Unpaid", variant: "warning", icon: CreditCard },
  PAID: { label: "Paid", variant: "success", icon: CheckCircle },
  REFUNDED: { label: "Refunded", variant: "purple", icon: CreditCard },
}

//
// 🎫 TICKET STATUS
//
export const ticketStatusMap: Record<string, StatusMeta> = {
  ACTIVE: { label: "Active", variant: "success", icon: Ticket },
  USED: { label: "Used", variant: "neutral", icon: CheckCircle },
  CANCELLED: { label: "Cancelled", variant: "destructive", icon: XCircle },
}

//
// 💳 PAYMENT METHOD
//
export const paymentMethodMap: Record<string, StatusMeta> = {
  MPESA: { label: "M-Pesa", variant: "success", icon: CreditCard },
  VISA: { label: "Visa", variant: "blue", icon: CreditCard },
  MASTERCARD: { label: "Mastercard", variant: "purple", icon: CreditCard },
  AMEX: { label: "Amex", variant: "indigo", icon: CreditCard },
  BANK_TRANSFER: { label: "Bank Transfer", variant: "info", icon: CreditCard },
  CASH: { label: "Cash", variant: "neutral", icon: CreditCard },
}

//
// JOB APPLICATION STATUS
//
export const jobApplicationStatusMap: Record<string, StatusMeta> = {
  PENDING: { label: "Pending", variant: "warning", icon: Clock, pulse: true },
  REVIEWED: { label: "Reviewed", variant: "info", icon: CheckCircle },
  SHORTLISTED: { label: "Shortlisted", variant: "blue", icon: Users },
  ACCEPTED: { label: "Accepted", variant: "success", icon: CheckCircle },
  REJECTED: { label: "Rejected", variant: "destructive", icon: XCircle },
}
