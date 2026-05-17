"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Link from "next/link"
import { Plane } from "lucide-react"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { adminSidebarData } from "@/constants/sidebar-data"
import { NavQuickLinks } from "./nav-quick-links"
import { dashboardSidebarData } from "@/constants/sidebar-data/dashboard-sidebar-data"

export function AppSidebar({ type, ...props }: React.ComponentProps<typeof Sidebar> & { type?: "admin" | "dashboard" }) {
  return (
    <Sidebar variant="inset" {...props}>
      {/* Header with Brand */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={type === "admin" ? "/admin" : "/dashboard"}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Plane className="size-4 -rotate-45" strokeWidth={2.5} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{type === "admin" ? "Kenya Airways" : "My Account"}</span>
                  <span className="truncate text-xs text-muted-foreground">{type === "admin" ? "Admin Panel" : "Kenya Airways"}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      {type === "admin" ? (
        <SidebarContent>
          <NavMain items={adminSidebarData.navMain} />
          <NavQuickLinks links={adminSidebarData.quickLinks} />
          <NavSecondary items={adminSidebarData.navSecondary} className="mt-auto" />
        </SidebarContent>
      ) : (
        <SidebarContent>
          <NavMain items={dashboardSidebarData.navMain} />
          <NavSecondary items={dashboardSidebarData.navSecondary} className="mt-auto" />
        </SidebarContent>
      )}

      {/* Footer with User */}
      <SidebarFooter>
        <NavUser type={type} />
      </SidebarFooter>
    </Sidebar>
  )
}
