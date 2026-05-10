import { DashboardStats } from "@/components/admin/dashboard/dashboard-stats"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Admin Dashboard | Kenya Airways",
  description: "Kenya Airways administration dashboard.",
}

async function getDashboardStats() {
  const [totalEmployees, activeEmployees, totalOpenings, openOpenings, totalMatches, recentMatches, totalTickets, recentEmployees] = await Promise.all([
    prisma.employee.count(),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.jobOpening.count(),
    prisma.jobOpening.count({ where: { isOpen: true } }),
    prisma.employeeAssignment.count(),
    prisma.employeeAssignment.findMany({
      take: 5,
      orderBy: { matchedAt: "desc" },
      include: {
        employee: { select: { firstName: true, lastName: true, position: true } },
        opening: { select: { title: true, department: true } },
      },
    }),
    prisma.ticket.count({ where: { status: "ACTIVE" } }),
    prisma.employee.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { firstName: true, lastName: true, department: true, position: true, isActive: true },
    }),
  ])

  return {
    totalEmployees,
    activeEmployees,
    totalOpenings,
    openOpenings,
    totalMatches,
    recentMatches,
    totalTickets,
    recentEmployees,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return <DashboardStats stats={stats} />
}
