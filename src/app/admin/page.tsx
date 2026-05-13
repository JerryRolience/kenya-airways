import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"

export const metadata = {
  title: "Admin Dashboard | Kenya Airways",
  description: "Kenya Airways administration dashboard.",
}

export default async function AdminDashboardPage() {
  const stats = {
    totalEmployees: 45,
    activeEmployees: 38,
    totalOpenings: 12,
    openOpenings: 8,
    totalMatches: 24,
    recentMatches: [],
    totalTickets: 15,
    recentEmployees: [],
  }

  return <DashboardStats stats={stats} />
}
