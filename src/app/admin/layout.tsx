"use client"

import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // const { isSignedIn, isLoaded } = useAuth()
  // const router = useRouter()

  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     router.push("/auth")
  //   }
  // }, [isSignedIn, isLoaded, router])

  // if (!isLoaded) {
  //   return null
  // }

  // if (!isSignedIn) {
  //   return null
  // }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}
