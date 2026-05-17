"use client"

import { fetchPassengerProfile } from "@/actions/passengers/fetch/fetch-passenger"
import { useQuery } from "@tanstack/react-query"

export function useFetchMyPassengerProfile() {
  return useQuery({
    queryKey: ["my-passenger-profile"],
    queryFn: fetchPassengerProfile,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  })
}
