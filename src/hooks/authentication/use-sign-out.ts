"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { useClerk } from "@clerk/nextjs"
import { useState } from "react"

export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { isSignedIn, signOut } = useClerk()

  const handleLogout = async () => {
    try {
      setIsSigningOut(true)
      if (!isSignedIn) {
        return ErrorHandler({ title: "You do not have an active session in order to perform this action.", action: "warning" })
      }

      await signOut({ redirectUrl: "/" })
    } catch (error: any) {
      return ErrorHandler({ title: error.message || "An error occurred while signing you out of your account. Please try again!", action: "warning" })
    } finally {
      setIsSigningOut(false)
    }
  }

  return { isSigningOut, handleLogout }
}
