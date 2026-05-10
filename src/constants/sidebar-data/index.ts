import { Briefcase, Building2, FileBarChart, LayoutDashboard, LifeBuoy, Plane, Settings2, Ticket, UserCheck, Users } from "lucide-react"

export const adminSidebarData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/admin",
        },
      ],
    },
    {
      title: "Employees",
      url: "/admin/employees",
      icon: Users,
      items: [
        {
          title: "All Employees",
          url: "/admin/employees",
        },
        {
          title: "Add Employee",
          url: "/admin/employees/new",
        },
      ],
    },
    {
      title: "Job Openings",
      url: "/admin/job-openings",
      icon: Briefcase,
      items: [
        {
          title: "All Openings",
          url: "/admin/job-openings",
        },
        {
          title: "Add Opening",
          url: "/admin/job-openings/new",
        },
      ],
    },
    {
      title: "Match Employee",
      url: "/admin/matches",
      icon: UserCheck,
      items: [
        {
          title: "New Match",
          url: "/admin/matches",
        },
        {
          title: "Match History",
          url: "/admin/matches/history",
        },
      ],
    },
    {
      title: "Tickets",
      url: "/admin/tickets",
      icon: Ticket,
      items: [
        {
          title: "Ticket Report",
          url: "/admin/tickets",
        },
      ],
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileBarChart,
      items: [
        {
          title: "Successful Matches",
          url: "/admin/reports",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
    },
    {
      title: "Help & Support",
      url: "/help",
      icon: LifeBuoy,
    },
  ],
  quickLinks: [
    {
      name: "View Site",
      url: "/",
      icon: Plane,
    },
    {
      name: "Manage Flights",
      url: "/admin/flights",
      icon: Building2,
    },
  ],
}
