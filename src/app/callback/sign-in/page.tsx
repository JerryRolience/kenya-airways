"use client"

import { onSignInUser } from "@/actions/auth/on-sign-in-user"
import { ErrorHandler } from "@/components/global/error-handler"
import { useQuery } from "@tanstack/react-query"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import DiscoverLoading from "../loading"
import { STATUS_CODES } from "@/constants/status-codes"
import { Role } from "../../../../generated/prisma/browser"

export default function CompleteSigIn() {
  const { data: authenticated, isPending, error } = useQuery({ queryKey: ["signInUser"], queryFn: () => onSignInUser(), retry: false })

  useEffect(() => {
    // Only run this effect when we have data and not pending
    if (!isPending && authenticated) {
      if (!authenticated?.success) {
        ErrorHandler({ title: "Failed to sign in", description: authenticated.message, action: "error" })
        redirect("/auth")
      }

      if (authenticated?.statusCode === STATUS_CODES.OK) {
        if (authenticated.data?.role === Role.PASSENGER) {
          redirect("/passenger/dashboard")
        } else if (authenticated.data?.role === Role.ADMIN || authenticated.data?.role === Role.SUPER_ADMIN) {
          redirect("/admin/dashboard")
        } else {
          redirect("/")
        }
      }
    }
  }, [authenticated, isPending])

  useEffect(() => {
    if (error) {
      ErrorHandler({
        title: "Failed to complete logging you in",
        description: authenticated?.message || error?.message,
        action: "error",
      })
      redirect("/auth")
    }
  }, [error, authenticated])

  if (isPending) {
    return <DiscoverLoading />
  }

  return null
}
