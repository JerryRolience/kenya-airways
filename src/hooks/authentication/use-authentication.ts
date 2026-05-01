"use client";

import { ErrorHandler } from "@/components/global/error-handler";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { customZodResolver } from "../custom-zod-resolver";
import { AuthSchema, SignUpSchema } from "@/validators/auth";
import z from "zod";

export function useAuthentication() {
  const { signIn, fetchStatus } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();

  const [verifying, setVerifying] = useState(false);
  const [showMissingRequirements, setShowMissingRequirements] = useState(false);
  const [code, setCode] = useState<string>("");

  const {
    register: emailInputRegister,
    formState: { errors: emailInputErrors },
    reset: resetEmailInput,
    handleSubmit: handleEmailSubmit,
  } = useForm<z.infer<typeof AuthSchema>>({
    resolver: customZodResolver(AuthSchema),
    mode: "onSubmit",
  });

  const {
    register: signUpRegister,
    control: signUpControl,
    formState: { errors: signUpErrors },
    reset: resetSignUp,
    handleSubmit: handleSignUpSubmit,
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: customZodResolver(SignUpSchema),
    mode: "onSubmit",
  });

  // Helper to finalize sign-in and navigate
  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  // Helper to finalize sign-up and navigate
  const finalizeSignUp = async (data?: z.infer<typeof SignUpSchema>) => {
    console.log("Finalizing sign-up with data:", data);
    resetSignUp();
    await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  // Step 1: Start sign-in with signUpIfMissing and send email code
  const handleGenerateCode = handleEmailSubmit(async (data) => {
    // Create sign-in for the signUpIfMissing flow.
    // The flow will proceed to verification regardless of whether an account exists or not.
    const { error: createError } = await signIn.create({
      identifier: data.email,
      signUpIfMissing: true,
    });
    if (createError) {
      console.error(JSON.stringify(createError, null, 2));
      ErrorHandler({
        title: createError.name || "Authentication error",
        description:
          createError.message ||
          "Failed to create sign-in session. Please try again.",
        action: "error",
      });
      return;
    }

    // Start the verification step
    if (!createError) {
      const { error: sendError } = await signIn.emailCode.sendCode();
      if (sendError) {
        console.error(JSON.stringify(sendError, null, 2));
        ErrorHandler({
          title: sendError.name || "Authentication error",
          description:
            sendError.message ||
            "Failed to send verification code. Please try again.",
          action: "error",
        });
      }

      setVerifying(true);
      resetEmailInput(); // Clear the email input form
    }
  });

  // Step 2: Verification step
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    let error: any = null;
    const { error: clearError } = await signIn.emailCode.verifyCode({ code });
    error = clearError;

    // When the user doesn't exist, verifyCode returns an error with
    // the code 'sign_up_if_missing_transfer'. Check for this error
    // to determine if we need to transfer to sign-up.
    if (error) {
      if (error.errors[0]?.code === "sign_up_if_missing_transfer") {
        // The user doesn't exist - transfer to sign-up
        await handleTransfer();
        setVerifying(false);
        return;
      }

      // Some other error occurred
      console.log(JSON.stringify(error, null, 2));
      ErrorHandler({
        title: error.name || "Authentication error",
        description:
          error.message || "Failed to verify email code. Please try again.",
        action: "error",
      });
      setVerifying(false);
      return;
    }

    // The user exists and verification succeeded
    if (signIn.status === "complete") {
      setVerifying(false);
      await finalizeSignIn();
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn.status);
      ErrorHandler({
        title: "Authentication error",
        description: "Unexpected sign-in status. Please try again.",
        action: "error",
      });
      setVerifying(false);
    }
  };

  // Step 3: Transfer to sign-up
  const handleTransfer = async () => {
    // Create sign-up using transfer.
    // This moves the verified identification from the sign-in to a new sign-up.
    const { error } = await signUp.create({ transfer: true });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      ErrorHandler({
        title: error.name || "Authentication error",
        description:
          error.message ||
          "Failed to create sign-up session. Please try again.",
        action: "error",
      });
      return;
    }

    if (signUp.status === "complete") {
      // No additional requirements - sign-up is complete
      await finalizeSignUp();
    } else if (signUp.status === "missing_requirements") {
      // Additional fields are required to complete sign-up.
      // Common missing fields include legal_accepted, first_name, last_name, etc.
      // Show a form to collect the missing fields.
      setShowMissingRequirements(true);
    } else {
      console.error("Unexpected sign-up status:", signUp.status);
      ErrorHandler({
        title: "Authentication error",
        description: "Unexpected sign-up status. Please try again.",
        action: "error",
      });
    }
  };

  // Step 4: Submit missing requirements to complete sign-up
  // const handleMissingRequirements = handleSignUpSubmit(async (data) => {
  //   // Update the sign-up with the missing fields. This will re-attempt to complete the sign-up.
  //   console.log("Submitting missing requirements:", data);

  //   const { error } = await signUp.update({
  //     firstName: data.firstName,
  //     lastName: data.lastName,
  //   });
  //   console.log("Sign-up update response:", { error });

  //   if (error) {
  //     console.error(error);
  //     ErrorHandler({
  //       title: error.name || "Authentication error",
  //       description:
  //         error.message ||
  //         "Failed to update sign-up session. Please try again.",
  //       action: "error",
  //     });
  //     return;
  //   }

  //   if (signUp.status === "complete") {
  //     await finalizeSignUp(data);
  //   } else if (signUp.status === "missing_requirements") {
  //     // Still missing other fields
  //     console.error("Additional fields still required:", signUp.missingFields);
  //     ErrorHandler({
  //       title: "Missing requirements",
  //       description: "Please complete all required fields.",
  //       action: "error",
  //     });
  //   } else {
  //     console.error("Unexpected sign-up status:", signUp.status);
  //     ErrorHandler({
  //       title: "Authentication error",
  //       description: "Unexpected sign-up status. Please try again.",
  //       action: "error",
  //     });
  //   }
  // });

  const handleMissingRequirements = handleSignUpSubmit(async (data) => {
    try {
      console.log("Submitting missing requirements:", data);

      // ✅ Don't destructure — signUp.update() throws on failure, doesn't return { error }
      await signUp.update({
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // ✅ After update, read signUp.status directly
      console.log("Status after update:", signUp.status);

      if (signUp.status === "complete") {
        await finalizeSignUp(data);
        return;
      }

      if (signUp.status === "missing_requirements") {
        console.error("Still missing:", signUp.missingFields);
        ErrorHandler({
          title: "Missing requirements",
          description: `Still missing: ${signUp.missingFields?.join(", ")}`,
          action: "error",
        });
        return;
      }
    } catch (err: unknown) {
      console.error("Raw error caught:", err);

      // ✅ Clerk errors land here — extract the message properly
      const clerkErr = err as {
        errors?: { code: string; message: string; longMessage: string }[];
        message?: string;
        status?: number;
      };

      const message =
        clerkErr?.errors?.[0]?.longMessage ||
        clerkErr?.errors?.[0]?.message ||
        clerkErr?.message ||
        "Failed to complete sign-up. Please try again.";

      ErrorHandler({
        title: "Sign-up error",
        description: message,
        action: "error",
      });
    }
  });

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
  };
}
