"use client"

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Plane } from "lucide-react"
import Link from "next/link"
import { AppSidebar } from "../app-sidebar"

export function DashboardLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar type="dashboard" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/30 bg-sidebar/5 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Link href="/" className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-accent -rotate-45" />
            <span className="text-sm font-semibold">Kenya Airways</span>
          </Link>
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
