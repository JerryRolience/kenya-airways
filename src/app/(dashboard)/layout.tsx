import { DashboardLayoutWrapper } from "@/components/sidebar/dashboard-sidebar/dashboard-layout-wrapper"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()

  if (!userId) {
    redirect("/auth")
  }

  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
}
