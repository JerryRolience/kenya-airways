"use client";

import AuthenticationForm from "@/components/forms/authentication-form";
import { ContinueWith } from "@/components/global/continue-with";
import { FormFooter } from "../_components";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/global/loader";
import { GoogleLogo } from "@/components/global/google-logo";

export default function AuthPage() {
  return (
    <div className="space-y-0">
      {/*  Heading  */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your account or create one, it only takes a moment.
        </p>
      </div>

      {/*  Google OAuth button  */}
      <Button
        variant="outline"
        className="w-full h-11 rounded-xl border-border font-medium text-sm hover:bg-muted/60 transition-colors gap-2.5"
      >
        <Loader loading={false}>
          <GoogleLogo />
          Continue with Google
        </Loader>
      </Button>

      {/*  Divider  */}
      <ContinueWith />

      {/*  Email form  */}
      <AuthenticationForm />

      {/*  Social links  */}
      <FormFooter />

      {/* Clerk bot protection */}
      <div id="clerk-captcha" />
    </div>
  );
}
