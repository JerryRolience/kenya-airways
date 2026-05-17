/* eslint-disable react-hooks/static-components */
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { useSignOut } from "@/hooks/authentication/use-sign-out"
import { useClerk } from "@clerk/nextjs"
import { BadgeCheck, ChevronsUpDown, Home, LogOut, Shield, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function NavUser({ type }: { type?: "admin" | "dashboard" }) {
  const { isMobile } = useSidebar()
  const { user } = useClerk()
  const { handleLogout, isSigningOut } = useSignOut()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fullName = mounted ? (user?.fullName ?? (type === "admin" ? "Admin User" : "Passenger")) : ""
  const email = mounted ? (user?.primaryEmailAddress?.emailAddress ?? (type === "admin" ? "admin@kenyaairways.co.ke" : "passenger@kenyaairways.co.ke")) : ""
  const imageUrl = mounted ? (user?.imageUrl ?? "") : ""
  const initials = fullName
    ? fullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD"

  const UserAvatar = ({ className }: { className?: string }) => (
    <Avatar className={className}>
      {imageUrl && <AvatarImage src={imageUrl} alt={fullName || type === "admin" ? "Admin" : "Passenger"} />}
      <AvatarFallback className="rounded-lg text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
    </Avatar>
  )

  const UserInfo = () => (
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{fullName}</span>
      <span className="truncate text-xs text-muted-foreground">{email}</span>
    </div>
  )

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer">
              <UserAvatar className="h-8 w-8 rounded-lg" />
              <UserInfo />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg" side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar className="h-8 w-8 rounded-lg" />
                <UserInfo />
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={type === "admin" ? "/admin/profile" : "/dashboard/profile"} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </DropdownMenuItem>
              {type === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
              )}
              {type === "dashboard" && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isSigningOut}
              onSelect={e => {
                e.preventDefault()
                handleLogout()
              }}
              className="text-destructive focus:text-destructive gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "Signing out..." : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
