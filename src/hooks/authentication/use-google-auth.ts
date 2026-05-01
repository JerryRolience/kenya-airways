"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { OAuthStrategy } from "@clerk/shared/types"

export function useGoogleAuth() {
  const { signUp, fetchStatus: isSigningUp } = useSignUp()
  const { signIn, fetchStatus: isSigningIn } = useSignIn()

  const handleAuthError = (error: unknown, action: "sign in" | "sign up") => {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

    console.error(`Error during ${action}:`, error instanceof Error ? { message: error.message, stack: error.stack } : error)
    ErrorHandler({ title: `Failed to ${action}`, description: errorMessage, action: "error" })
  }

  const signInWith = async (strategy: OAuthStrategy) => {
    try {
      const { error } = await signIn.sso({
        strategy,
        redirectCallbackUrl: "/callback",
        redirectUrl: "/callback/sign-in",
      })
      if (error) {
        handleAuthError(error, "sign in")
        return
      }
    } catch (error) {
      handleAuthError(error, "sign in")
    }
  }

  const signUpWith = async (strategy: OAuthStrategy) => {
    try {
      const { error } = await signUp.sso({
        strategy,
        redirectCallbackUrl: "/callback",
        redirectUrl: "/callback/complete",
      })
      if (error) {
        handleAuthError(error, "sign up")
        return
      }
    } catch (error) {
      handleAuthError(error, "sign up")
    }
  }

  return { signInWith, signUpWith, isSigningIn, isSigningUp }
}
