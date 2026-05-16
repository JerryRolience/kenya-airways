"use client"

import { AdminLayoutWrapper } from "@/components/sidebar/admin-dashboard-sidebar/admin-layout-wrapper"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth")
    }
  }, [isSignedIn, isLoaded, router])

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return null
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}
