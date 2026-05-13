"use client"

import { ErrorHandler } from "@/components/global/error-handler"
import { useSignIn, useSignUp } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { customZodResolver } from "../custom-zod-resolver"
import { AuthSchema, PassengerSignUpSchema } from "@/validators/auth"
import z from "zod"
import { onSignUpPassenger } from "@/actions/auth/on-sign-up-passenger"
import { onSignInUser } from "@/actions/auth/on-sign-in-user"
import { Role } from "../../../generated/prisma/enums"

export function useAuthentication() {
  const { signIn, fetchStatus } = useSignIn()
  const { signUp } = useSignUp()
  const router = useRouter()

  const [verifying, setVerifying] = useState(false)
  const [showMissingRequirements, setShowMissingRequirements] = useState(false)
  const [code, setCode] = useState<string>("")

  const {
    register: emailInputRegister,
    formState: { errors: emailInputErrors },
    reset: resetEmailInput,
    handleSubmit: handleEmailSubmit,
  } = useForm<z.infer<typeof AuthSchema>>({
    resolver: customZodResolver(AuthSchema),
    mode: "onSubmit",
  })

  const {
    register: signUpRegister,
    control: signUpControl,
    formState: { errors: signUpErrors },
    reset: resetSignUp,
    handleSubmit: handleSignUpSubmit,
  } = useForm<z.infer<typeof PassengerSignUpSchema>>({
    resolver: customZodResolver(PassengerSignUpSchema),
    mode: "onSubmit",
  })

  // Helper to finalize sign-in and navigate
  const finalizeSignIn = async () => {
    await signIn.finalize({ navigate: () => {} })

    const result = await onSignInUser()

    if (!result.success) {
      ErrorHandler({
        title: "Sign-in error",
        description: result.message || "An error occurred during sign-in. Please try again.",
        action: "error",
      })
      return
    }

    ErrorHandler({
      title: "Welcome back! You have successfully logged back in.",
      action: "success",
    })

    if (result.data?.role === Role.PASSENGER) {
      router.push("/passenger/dashboard")
    } else {
      router.push("/admin")
    }
  }

  // Helper to finalize sign-up and navigate
  const finalizeSignUp = async (data: z.infer<typeof PassengerSignUpSchema>) => {
    const email = signUp.emailAddress || ""

    await signUp.finalize({ navigate: () => {} })

    const result = await onSignUpPassenger({ ...data, email })

    if (!result.success) {
      ErrorHandler({
        title: "Sign-up error",
        description: result.message || "An error occurred during sign-up. Please try again.",
        action: "error",
      })
      return
    }

    ErrorHandler({
      title: "Sign-up successful",
      description: result.message || "Your account has been created successfully!",
      action: "success",
    })
    router.push("/passenger/dashboard")
    resetSignUp()
  }

  // Step 1: Start sign-in with signUpIfMissing and send email code
  const handleGenerateCode = handleEmailSubmit(async data => {
    // Create sign-in for the signUpIfMissing flow.
    // The flow will proceed to verification regardless of whether an account exists or not.
    const { error: createError } = await signIn.create({
      identifier: data.email,
      signUpIfMissing: true,
    })

    if (createError) {
      // console.error(JSON.stringify(createError, null, 2))
      ErrorHandler({
        title: createError.message || "Authentication error",
        description: createError.longMessage || "Failed to create sign-in session. Please try again.",
        action: "error",
      })
      return
    }

    // Start the verification step
    if (!createError) {
      const { error: sendError } = await signIn.emailCode.sendCode()
      if (sendError) {
        // console.error(JSON.stringify(sendError, null, 2))
        ErrorHandler({
          title: sendError.message || "Authentication error",
          description: sendError.longMessage || "Failed to send verification code. Please try again.",
          action: "error",
        })
      }

      setVerifying(true)
      resetEmailInput() // Clear the email input form
    }
  })

  // Step 2: Verification step
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    let error: any = null
    const { error: clearError } = await signIn.emailCode.verifyCode({ code })
    error = clearError

    // When the user doesn't exist, verifyCode returns an error with
    // the code 'sign_up_if_missing_transfer'. Check for this error
    // to determine if we need to transfer to sign-up.
    if (error) {
      if (error.errors[0]?.code === "sign_up_if_missing_transfer") {
        // The user doesn't exist - transfer to sign-up
        await handleTransfer()
        setVerifying(false)
        return
      }

      // Some other error occurred
      // console.log(JSON.stringify(error, null, 2))
      ErrorHandler({
        title: error.message || "Authentication error",
        description: error.longMessage || "Failed to verify email code. Please try again.",
        action: "error",
      })
      setVerifying(false)
      return
    }

    // The user exists and verification succeeded
    if (signIn.status === "complete") {
      setVerifying(false)
      await finalizeSignIn()
    } else {
      // Check why the sign-in is not complete
      // console.error("Sign-in attempt not complete:", signIn.status)
      ErrorHandler({
        title: "Authentication error",
        description: "Unexpected sign-in status. Please try again.",
        action: "error",
      })
      setVerifying(false)
    }
  }

  // Step 3: Transfer to sign-up
  const handleTransfer = async () => {
    // Create sign-up using transfer.
    // This moves the verified identification from the sign-in to a new sign-up.
    const { error } = await signUp.create({ transfer: true })
    if (error) {
      // console.error(JSON.stringify(error, null, 2))
      ErrorHandler({
        title: error.message || "Authentication error",
        description: error.longMessage || "Failed to create sign-up session. Please try again.",
        action: "error",
      })
      return
    }

    if (signUp.status === "complete") {
      // No additional requirements - sign-up is complete and we can collect any needed info from the sign-up object before finalizing.
      setShowMissingRequirements(true)
    } else {
      // console.error("Unexpected sign-up status:", signUp.status)
      ErrorHandler({
        title: "Authentication error",
        description: "Unexpected sign-up status. Please try again.",
        action: "error",
      })
    }
  }

  // Step 4: Submit missing requirements to complete sign-up
  const handleMissingRequirements = handleSignUpSubmit(async data => {
    try {
      if (signUp.status === "complete") {
        await finalizeSignUp(data)
      } else {
        ErrorHandler({
          title: "Authentication error",
          description: "Unexpected sign-up status. Please try again.",
          action: "error",
        })
      }
    } catch (error: any) {
      // console.error("Error updating sign-up with missing requirements:", error)
      ErrorHandler({
        title: "Authentication error",
        description: error.message || "Failed to submit missing requirements. Please try again.",
        action: "error",
      })
    }
  })

  return {
    signIn,
    handleGenerateCode,
    handleVerify,
    handleMissingRequirements,
    emailInputRegister,
    signUpRegister,
    signUpControl,
    emailInputErrors,
    signUpErrors,
    code,
    setCode,
    fetchStatus,
    verifying,
    showMissingRequirements,
  }
}
