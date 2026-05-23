"use client"

import { Button } from "@/components/ui/button"
import { useFetchProfile } from "@/hooks/profile/use-fetch-profile"
import { AppError } from "@/lib/app-error"
import { Briefcase, CreditCard, Edit, Ticket } from "lucide-react"
import { useState } from "react"
import { Role } from "../../../generated/prisma/enums"
import { EmployeeInfoCard } from "./employee-info-card"
import { PassengerInfoCard } from "./passenger-info-card"
import { UserProfileAccountInfoCard } from "./user-account-info-card"
import { UserProfileAccountInfo } from "./user-profile-account-info"
import { UserProfileEmptyState } from "./user-profile-empty-state"
import { UserProfileErrorState } from "./user-profile-error-state"
import { UserProfileLoadingState } from "./user-profile-loading-state"
import { StatsMiniCard } from "./utils"
import { UserProfileForm } from "../forms/user-profile-form"

export default function UserProfilePage({ dashboardType }: { dashboardType: "admin" | "user" }) {
  const [editMode, setEditMode] = useState(false)

  const { data: response, isLoading, isError, error, refetch } = useFetchProfile()
  const profile = response?.data

  //  Loading State
  if (isLoading) {
    return <UserProfileLoadingState />
  }

  //  Error State
  if (isError) {
    const message = error instanceof AppError ? error.message : "We couldn't load your profile."
    return <UserProfileErrorState message={message} refetch={refetch} dashboardType={dashboardType} />
  }

  //  Not Found State
  if (!profile) {
    return <UserProfileEmptyState dashboardType={dashboardType} />
  }

  const isAdmin = profile.role === Role.ADMIN || profile.role === Role.SUPER_ADMIN

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information and account settings.</p>
        </div>
        <Button onClick={() => setEditMode(!editMode)} variant="outline" className="rounded-xl gap-2 self-start sm:self-auto hover:cursor-pointer">
          <Edit className="h-4 w-4" />
          {editMode ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/*  Left Column: Avatar + Account Info  */}
        <UserProfileAccountInfo profile={profile} dashboardType={dashboardType} />

        {/*  Right Column: Details + Stats  */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          {!isAdmin && (
            <div className="grid gap-4 sm:grid-cols-3">
              <StatsMiniCard icon={Ticket} value={profile.totalBookings} label="Total Bookings" href="/dashboard/bookings" color="bg-blue-50 border-blue-200 text-blue-600" />
              <StatsMiniCard icon={Briefcase} value={profile.totalApplications} label="Applications" href="/dashboard/applications" color="bg-purple-50 border-purple-200 text-purple-600" />
              <StatsMiniCard icon={CreditCard} value={profile.totalPayments} label="Payments" href="/dashboard/payments" color="bg-emerald-50 border-emerald-200 text-emerald-600" />
            </div>
          )}

          {/* Passenger Info Card */}
          {profile.passenger && <PassengerInfoCard passenger={profile.passenger} />}

          {/* Employee Info Card */}
          {profile.employee && <EmployeeInfoCard employee={profile.employee} />}

          {/* Account Info Card */}
          <UserProfileAccountInfoCard profile={profile} />
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {editMode && <UserProfileForm user={profile} open={editMode} setOpen={setEditMode} />}
    </div>
  )
}
