import { Briefcase, FileBarChart, LayoutDashboard, LifeBuoy, Plane, Ticket, UserCheck, Users } from "lucide-react"

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
      ],
    },
    {
      title: "Passengers",
      url: "/admin/passengers",
      icon: UserCheck,
      items: [
        {
          title: "All Passengers",
          url: "/admin/passengers",
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
          title: "All Applications",
          url: "/admin/job-openings/applications",
        },
      ],
    },
    {
      title: "Match Employee",
      url: "/admin/matches",
      icon: UserCheck,
      items: [
        {
          title: "Match History",
          url: "/admin/matches",
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
  ],
}
