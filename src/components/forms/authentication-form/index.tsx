"use client";

import { Loader } from "@/components/global/loader";
import { Button } from "@/components/ui/button";
import { AUTH_FORM, SIGN_UP_FORM } from "@/constants/auth";
import { useAuthentication } from "@/hooks/authentication/use-authentication";
import { FormGenerator } from "../form-generator";
import { OTPInput } from "@/components/otp-input";
import { ArrowLeft, Mail, UserPlus } from "lucide-react";

export default function AuthenticationForm() {
  const {
    fetchStatus,
    showMissingRequirements,
    verifying,
    signIn,
    emailInputRegister,
    emailInputErrors,
    signUpErrors,
    signUpRegister,
    signUpControl,
    code,
    setCode,
    handleMissingRequirements,
    handleGenerateCode,
    handleVerify,
  } = useAuthentication();

  //  State 3: Complete your account (missing requirements)
  if (showMissingRequirements) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <UserPlus className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Complete your account
            </p>
            <p className="text-xs text-muted-foreground">
              Your email was verified. Just a few more details.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleMissingRequirements} className="space-y-4">
          {SIGN_UP_FORM.map((field) => (
            <FormGenerator
              key={field.id}
              inputType={field.inputType}
              name={field.name}
              placeholder={field.placeholder}
              errors={signUpErrors}
              type={field.type}
              label={field.label}
              register={signUpRegister}
              control={signUpControl}
            />
          ))}

          <Button
            type="submit"
            disabled={fetchStatus === "fetching"}
            className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Loader loading={fetchStatus === "fetching"}>
              {fetchStatus === "fetching"
                ? "Creating account…"
                : "Create account"}
            </Loader>
          </Button>
        </form>

        {/* Back link */}
        <button
          type="button"
          onClick={() => signIn.reset()}
          className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Start over
        </button>
      </div>
    );
  }

  //  State 2: OTP verification
  //   State 1: Email input
  return (
    <form
      onSubmit={verifying ? handleVerify : handleGenerateCode}
      className="mt-6 flex flex-col gap-4"
    >
      {verifying ? (
        /*  OTP state  */
        <div className="space-y-5">
          {/* Info banner */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Check your inbox
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We sent a 6-digit code to your email. Enter it below to
                continue.
              </p>
            </div>
          </div>

          {/* OTP input */}
          <div className="space-y-4 flex flex-col items-center justify-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Verification code
            </label>
            <OTPInput otp={code} setOtp={setCode} />
          </div>

          {/* Resend + back */}
          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => signIn.emailCode.sendCode()}
              className="text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer"
            >
              Resend code
            </button>
            <button
              type="button"
              onClick={() => signIn.reset()}
              className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={fetchStatus === "fetching" || code.length < 6}
            className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Loader loading={fetchStatus === "fetching"}>
              {fetchStatus === "fetching"
                ? "Verifying…"
                : "Complete verification"}
            </Loader>
          </Button>
        </div>
      ) : (
        /*  Email state  */
        <>
          {AUTH_FORM.map((field) => (
            <FormGenerator
              key={field.id}
              inputType={field.inputType}
              name={field.name}
              placeholder={field.placeholder}
              errors={emailInputErrors}
              type={field.type}
              label={field.label}
              register={emailInputRegister}
            />
          ))}

          <Button
            type="submit"
            disabled={fetchStatus === "fetching"}
            className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Loader loading={fetchStatus === "fetching"}>
              {fetchStatus === "fetching"
                ? "Continuing…"
                : "Continue with email"}
            </Loader>
          </Button>
        </>
      )}
    </form>
  );
}
