import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const CompleteOAuthAfterCallback = async () => {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  // const userData = {
  //   firstName: user.firstName || "",
  //   lastName: user.lastName || "",
  //   phone: user.phoneNumbers?.[0]?.phoneNumber || "",
  //   image: user.imageUrl || "",
  // }

  // const complete = await onSignUpPassenger(userData)

  // if (complete.statusCode == 200) {
  //   redirect("/passenger/dashboard")
  // } else {
  //   redirect("/auth")
  // }
}

export default CompleteOAuthAfterCallback
