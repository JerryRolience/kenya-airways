// "use client"

// import { GoogleLogo } from "@/components/global/google-logo"
// import { Loader } from "@/components/global/loader"
// import { Button } from "@/components/ui/button"
// import { useGoogleAuth } from "@/hooks/authentication/use-google-auth"

// type GoogleAuthButtonProps = {
//   method: "signup" | "signin"
// }

// export function GoogleAuthButton({ method }: GoogleAuthButtonProps) {
//   const { signUpWith, signInWith, isSigningIn, isSigningUp } = useGoogleAuth()
//   return (
//     <Button
//       variant="outline"
//       className="w-full py-5 rounded-lg text-base font-medium border-border hover:bg-muted/50  hover:cursor-pointer"
//       disabled={isSigningIn || isSigningUp}
//       {...(method === "signin"
//         ? {
//             onClick: () => signInWith("oauth_google"),
//           }
//         : {
//             onClick: () => signUpWith("oauth_google"),
//           })}
//     >
//       <Loader loading={method === "signin" ? isSigningIn : isSigningUp}>
//         <GoogleLogo />
//         {isSigningIn ? "Signing in..." : isSigningUp ? "Signing up..." : " Google"}
//       </Loader>
//     </Button>
//   )
// }
