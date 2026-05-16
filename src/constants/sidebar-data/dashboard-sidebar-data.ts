import { LayoutDashboard, Plane, Ticket, Briefcase, User, CreditCard, Settings, HelpCircle } from "lucide-react"

export const dashboardSidebarData = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Flights",
      url: "/dashboard/flights",
      icon: Plane,
    },
    {
      title: "My Bookings",
      url: "/dashboard/bookings",
      icon: Ticket,
    },
    {
      title: "My Applications",
      url: "/dashboard/applications",
      icon: Briefcase,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: CreditCard,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/help",
      icon: HelpCircle,
    },
  ],
}
